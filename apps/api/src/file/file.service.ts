import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";

import { S3Service } from "src/s3/s3.service";

import { MAX_FILE_SIZE, REDIS_TTL } from "./file.constants";

import type { createCache } from "cache-manager";

@Injectable()
export class FileService {
  constructor(
    private readonly s3Service: S3Service,
    @Inject("CACHE_MANAGER") private cacheManager: ReturnType<typeof createCache>,
  ) {}

  async getFileUrl(fileKey: string): Promise<string> {
    if (!fileKey) return "https://app.lms.localhost/app/assets/placeholders/card-placeholder.jpg";
    if (fileKey.startsWith("https://")) return fileKey;

    try {
      const cachedUrl = await this.cacheManager.get<string>(fileKey);
      if (cachedUrl) return cachedUrl;

      const signedUrl = await this.s3Service.getSignedUrl(fileKey);
      await this.cacheManager.set(fileKey, signedUrl, REDIS_TTL);
      return signedUrl;
    } catch (error) {
      console.error("Error in getFileUrl:", error);
      return this.s3Service.getSignedUrl(fileKey);
    }
  }

  async uploadFile(file: Express.Multer.File, resource: string) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "video/mp4",
      "video/quicktime",
    ];

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE} bytes`,
      );
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types are: ${allowedMimeTypes.join(
          ", ",
        )}`,
      );
    }

    try {
      const fileExtension = file.originalname.split(".").pop();
      const fileKey = `${resource}/${crypto.randomUUID()}.${fileExtension}`;

      await this.s3Service.uploadFile(file.buffer, fileKey, file.mimetype);

      const fileUrl = await this.s3Service.getSignedUrl(fileKey);

      return { fileKey, fileUrl };
    } catch (error) {
      throw new ConflictException("Failed to upload file");
    }
  }

  async deleteFile(fileKey: string) {
    try {
      return await this.s3Service.deleteFile(fileKey);
    } catch (error) {
      throw new ConflictException("Failed to delete file");
    }
  }
}
