import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Get,
  Param,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { Type } from "@sinclair/typebox";
import { Response } from "express";
import { Validate } from "nestjs-typebox";

import { BaseResponse, UUIDSchema, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { ScormUploadResponse } from "./schemas/scorm.schema";
import { ScormService } from "./services/scorm.service";

@Controller("scorm")
@UseGuards(RolesGuard)
export class ScormController {
  constructor(private readonly scormService: ScormService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @Roles(USER_ROLES.admin, USER_ROLES.teacher)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        resource: {
          type: "string",
          description: "Optional resource type",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    type: ScormUploadResponse,
  })
  async uploadScormPackage(
    @UploadedFile() file: Express.Multer.File,
    @Query("courseId") courseId: UUIDType,
    @CurrentUser("userId") userId: UUIDType,
  ) {
    if (!courseId) {
      throw new BadRequestException("courseId is required");
    }

    if (!file) {
      throw new BadRequestException("file is required");
    }

    const metadata = await this.scormService.processScormPackage(file, courseId, userId);

    return new BaseResponse({
      message: "SCORM package uploaded successfully",
      metadata,
    });
  }

  @Roles(...Object.values(USER_ROLES))
  @Get(":courseId/content")
  @Validate({
    request: [
      { type: "param", name: "courseId", schema: UUIDSchema },
      { type: "query", name: "path", schema: Type.String() },
    ],
  })
  async serveScormContent(
    @Param("courseId") courseId: UUIDType,
    @Query("path") filePath: string,
    @Res() res: Response,
  ) {
    if (!filePath) {
      throw new BadRequestException("filePath is required");
    }

    const url = await this.scormService.serveContent(courseId, filePath);
    return res.redirect(url);
  }
}
