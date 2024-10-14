import {
  BadRequestException,
  ConflictException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as crypto from "crypto";
import { S3Service } from "../s3.service";
import { FileUploadResponse } from "../schemas/file.schema";

import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
@Controller("upload")
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    type: FileUploadResponse,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponse> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "video/mp4",
      "video/quicktime",
    ];

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${maxSize} bytes`,
      );
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types are: ${allowedMimeTypes.join(", ")}`,
      );
    }

    try {
      const fileExtension = file.originalname.split(".").pop();
      const fileKey = `files/${crypto.randomUUID()}.${fileExtension}`;

      await this.s3Service.uploadFile(file.buffer, fileKey, file.mimetype);

      const fileUrl = await this.s3Service.getSignedUrl(fileKey);

      return { fileKey, fileUrl };
    } catch (error) {
      throw new ConflictException("Failed to upload file");
    }
  }
}
