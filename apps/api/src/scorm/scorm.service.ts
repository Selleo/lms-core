import { randomUUID } from "crypto";

import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import AdmZip from "adm-zip";
import { eq } from "drizzle-orm";
import xml2js from "xml2js";

import { DatabasePg } from "src/common";
import { S3Service } from "src/file/s3.service";
import { scormMetadata, files } from "src/storage/schema";

import type { UUIDType } from "src/common";

@Injectable()
export class ScormService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async processScormPackage(file: Express.Multer.File, courseId: UUIDType, userId: UUIDType) {
    const zip = new AdmZip(file.buffer);

    const manifestEntry = zip.getEntry("imsmanifest.xml");
    if (!manifestEntry) {
      throw new BadRequestException("Invalid SCORM package - missing manifest");
    }

    const manifestContent = manifestEntry.getData().toString("utf8");
    const manifest = await xml2js.parseStringPromise(manifestContent);

    const version = this.detectScormVersion(manifest);
    const entryPoint = this.findEntryPoint(manifest);

    const s3BaseKey = `scorm/${courseId}/${randomUUID()}`;
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (!entry.isDirectory) {
        const s3Key = `${s3BaseKey}/${entry.entryName}`;
        await this.s3Service.uploadFile(entry.getData(), s3Key, this.getContentType(entry.name));
      }
    }

    const [createdFile] = await this.db
      .insert(files)
      .values({
        title: file.originalname,
        type: "scorm-package",
        url: s3BaseKey,
        authorId: userId,
      })
      .returning();

    const [metadata] = await this.db
      .insert(scormMetadata)
      .values({
        courseId,
        fileId: createdFile.id,
        version,
        entryPoint,
        s3Key: s3BaseKey,
      })
      .returning();

    return metadata;
  }

  async serveContent(courseId: UUIDType, filePath: string, userId: UUIDType): Promise<string> {
    const [metadata] = await this.db
      .select()
      .from(scormMetadata)
      .where(eq(scormMetadata.courseId, courseId));

    if (!metadata) {
      throw new NotFoundException("SCORM content not found");
    }

    const s3Key = `${metadata.s3Key}/${filePath}`;
    return await this.s3Service.getSignedUrl(s3Key);
  }

  private detectScormVersion(manifest: any): string {
    const schemaVersion = manifest?.manifest?.metadata?.[0]?.schemaversion?.[0];
    if (schemaVersion?.includes("1.2")) return "1.2";
    if (schemaVersion?.includes("2004")) return "2004";
    return "1.2";
  }

  private findEntryPoint(manifest: any): string {
    const resources = manifest?.manifest?.resources?.[0]?.resource;
    const sco = resources?.find((r: any) => r.$["adlcp:scormtype"]?.toLowerCase() === "sco");

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
