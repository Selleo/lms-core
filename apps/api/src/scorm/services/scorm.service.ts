import { randomUUID } from "crypto";

import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import AdmZip from "adm-zip";
import xml2js from "xml2js";

import { DatabasePg } from "src/common";
import { S3Service } from "src/s3/s3.service";

import { ScormRepository } from "../repositories/scorm.repository";

import type { UUIDType } from "src/common";

@Injectable()
export class ScormService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly scormRepository: ScormRepository,
  ) {}

  async processScormPackage(file: Express.Multer.File, courseId: UUIDType, userId: UUIDType) {
    return await this.db.transaction(async (tx) => {
      try {
        const { version, entryPoint, entries } = await this.parseAndValidateScorm(file);

        const s3BaseKey = `scorm/${courseId}/${randomUUID()}`;

        await Promise.all(
          entries
            .filter((entry) => !entry.isDirectory)
            .map((entry) =>
              this.s3Service.uploadFile(
                entry.getData(),
                `${s3BaseKey}/${entry.entryName}`,
                this.getContentType(entry.name),
              ),
            ),
        );

        const createdFile = await this.scormRepository.createScormFile(
          {
            title: file.originalname,
            type: "scorm-package",
            url: s3BaseKey,
            authorId: userId,
          },
          tx,
        );

        const metadata = await this.scormRepository.createScormMetadata(
          {
            courseId,
            fileId: createdFile.id,
            version,
            entryPoint,
            s3Key: s3BaseKey,
          },
          tx,
        );

        return metadata;
      } catch (error) {
        try {
          await this.s3Service.deleteFile(`courses/${courseId}`);
        } catch (cleanupError) {
          console.error("Failed to cleanup S3 files:", cleanupError);
        }
        throw error;
      }
    });
  }

  async serveContent(courseId: UUIDType, filePath: string, userId: UUIDType): Promise<string> {
    const metadata = await this.scormRepository.getScormMetadata(courseId);

    if (!metadata) {
      throw new NotFoundException("SCORM content not found");
    }

    const s3Key = `${metadata.s3Key}/${filePath}`;
    return await this.s3Service.getSignedUrl(s3Key);
  }

  private async parseAndValidateScorm(file: Express.Multer.File) {
    const zip = new AdmZip(file.buffer);

    const manifestEntry = zip.getEntry("imsmanifest.xml");
    if (!manifestEntry) {
      throw new BadRequestException("Invalid SCORM package - missing manifest");
    }

    const manifestContent = manifestEntry.getData().toString("utf8");
    const manifest = await xml2js.parseStringPromise(manifestContent);

    return {
      version: this.detectScormVersion(manifest),
      entryPoint: this.findEntryPoint(manifest),
      entries: zip.getEntries(),
    };
  }

  private detectScormVersion(manifest: any): string {
    const schemaVersion = manifest?.manifest?.metadata?.[0]?.schemaversion?.[0];
    if (schemaVersion?.includes("1.2")) return "1.2";
    if (schemaVersion?.includes("2004")) return "2004";
    return "1.2";
  }

  private findEntryPoint(manifest: any): string {
    const resources = manifest?.manifest?.resources?.[0]?.resource;
    const sco = resources?.find(
      (resource: any) =>
        resource.$["adlcp:scormtype"]?.toLowerCase() === "sco" ||
        resource.$["adlcp:scormType"]?.toLowerCase() === "sco",
    );

    if (!sco || !sco.$?.href) {
      throw new BadRequestException("Invalid SCORM package - no entry point found");
    }

    return sco.$.href;
  }

  private getContentType(filename: string): string {
    const map: Record<string, string> = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".jpg": "image/jpeg",
      ".png": "image/png",
    };

    const ext = filename.toLowerCase().split(".").pop();
    return map[`.${ext}`] || "application/octet-stream";
  }
}
