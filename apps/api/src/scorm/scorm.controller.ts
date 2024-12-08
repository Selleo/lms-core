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
import { Response } from "express";

import { BaseResponse, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { ScormService } from "./services/scorm.service";

@Controller("scorm")
@UseGuards(RolesGuard)
export class ScormController {
  constructor(private readonly scormService: ScormService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @Roles(USER_ROLES.admin, USER_ROLES.teacher)
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

  @Get(":courseId/content/*")
  @Roles(...Object.values(USER_ROLES))
  async serveScormContent(
    @Param("courseId") courseId: UUIDType,
    @Param("0") filePath: string,
    @Res() res: Response,
    @CurrentUser("userId") userId: UUIDType,
  ) {
    if (!filePath) {
      throw new BadRequestException("filePath is required");
    }

    const url = await this.scormService.serveContent(courseId, filePath, userId);
    return res.redirect(url);
  }
}
