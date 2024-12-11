import { randomUUID } from "crypto";

import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import AdmZip from "adm-zip";
import xml2js from "xml2js";

import { DatabasePg } from "src/common";
import { S3Service } from "src/s3/s3.service";

import { SCORM } from "../constants/scorm.consts";
import { ScormRepository } from "../repositories/scorm.repository";

import type { UUIDType } from "src/common";

@Injectable()
export class ScormService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly scormRepository: ScormRepository,
  ) {}

  /**
   * Processes uploaded SCORM package. Each SCORM package is a ZIP containing:
   * - imsmanifest.xml (defines structure and metadata)
   * - HTML/JS/CSS files (actual content)
   * - Additional resources (images, etc.)
   *
   * Process:
   * 1. Extracts and validates imsmanifest.xml
   * 2. Uploads all files to S3 maintaining folder structure
   * 3. Creates DB records linking SCORM to course
   *
   * Example manifest structure:
   * <manifest>
   *   <metadata>
   *     <schemaversion>1.2</schemaversion>
   *   </metadata>
   *   <resources>
   *     <resource identifier="R1" type="webcontent" adlcp:scormtype="sco" href="index.html"/>
   *   </resources>
   * </manifest>
   *
   * @param file - SCORM ZIP file uploaded by user
   * @param courseId - Course to which this SCORM belongs
   * @param userId - User who uploaded the package
   * @returns Created metadata record with files location and entry point
   * @throws BadRequestException if package is invalid
   */
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
            s3KeyPath: s3BaseKey,
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

  /**
   * Serves content from uploaded SCORM package.
   * All SCORM content must be served from the same origin as the LMS for APIs to work.
   * We achieve this by:
   * 1. Finding the S3 location using metadata
   * 2. Generating signed URL for requested file
   * 3. Redirecting browser to signed URL
   *
   * Note: Original file paths from manifest must be preserved for SCORM to work.
   * Example: if manifest has href="content/index.html", that exact path must be used.
   *
   * @param courseId - Course containing the SCORM
   * @param filePath - Original path of file inside SCORM package
   * @returns Signed S3 URL for the file
   */
  async serveContent(courseId: UUIDType, filePath: string): Promise<string> {
    const metadata = await this.scormRepository.getScormMetadata(courseId);

    if (!metadata) {
      throw new NotFoundException("SCORM content not found");
    }

    const s3Key = `${metadata.s3Key}/${filePath}`;
    return await this.s3Service.getSignedUrl(s3Key);
  }

  /**
   * Extracts and validates SCORM manifest.
   * Each SCORM package must have imsmanifest.xml in root directory.
   * This file defines:
   * - SCORM version (1.2 or 2004)
   * - Course structure and sequence
   * - Files and dependencies
   * - Entry point (first SCO)
   *
   * @throws BadRequestException if:
   * - ZIP doesn't contain imsmanifest.xml
   * - Manifest is malformed
   * - Required fields are missing
   */
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

  /**
   * Detects SCORM version from manifest.
   * Two main versions exist:
   * - SCORM 1.2: older but widely used
   * - SCORM 2004: newer with advanced sequencing
   *
   * Version is specified in manifest:
   * <metadata>
   *   <schemaversion>1.2</schemaversion>  // or "2004 3rd Edition" etc.
   * </metadata>
   *
   * Defaults to 1.2 if version can't be determined as it's more widely compatible.
   */
  private detectScormVersion(manifest: any): string {
    const schemaVersion = manifest?.manifest?.metadata?.[0]?.schemaversion?.[0];
    if (schemaVersion?.includes("1.2")) return "1.2";
    if (schemaVersion?.includes("2004")) return "2004";
    return "1.2";
  }

  /**
   * Finds first SCO (Sharable Content Object) to use as entry point.
   *
   * SCO is an HTML page that:
   * - Communicates with LMS through SCORM API
   * - Can save student's progress
   * - Can save test/quiz results
   * - Can track time spent on page
   *
   * Example: you have course with 5 lessons, each lesson is a separate SCO that:
   * - Saves whether student completed the lesson
   * - Saves quiz results at the end
   * - Remembers where student stopped (to return to the same place)
   *
   * In manifest.xml SCO is marked with special attribute:
   * SCORM 1.2:
   * <resource type="webcontent" adlcp:scormtype="sco" href="index.html"/>
   *
   * SCORM 2004:
   * <resource type="webcontent" adlcp:scormType="sco" href="index.html"/>
   *
   * Other resources (like images) are "asset" type and can't communicate with LMS.
   *
   * @throws BadRequestException if no SCO found (package must have at least one)
   */
  private findEntryPoint(manifest: any): string {
    const resources = manifest?.manifest?.resources?.[0]?.resource;
    const sco = resources?.find(
      (resource: any) =>
        resource.$["adlcp:scormtype"]?.toLowerCase() === SCORM.SCO ||
        resource.$["adlcp:scormType"]?.toLowerCase() === SCORM.SCO,
    );

    if (!sco || !sco.$?.href) {
      throw new BadRequestException("Invalid SCORM package - no entry point found");
    }

    return sco.$.href;
  }

  /**
   * Maps file extensions to MIME types.
   * Correct MIME types are required for:
   * - Browser to properly handle files
   * - S3 to serve files correctly
   * - SCORM API scripts to execute
   *
   * Common SCORM files:
   * - .html - Main content
   * - .js - SCORM API implementation
   * - .css - Styling
   * - .jpg/.png - Images
   */
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
