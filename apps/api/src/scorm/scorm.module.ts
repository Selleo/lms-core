import { Module } from "@nestjs/common";

import { S3Module } from "src/file/s3.module";

import { ScormController } from "./scorm.controller";
import { ScormService } from "./scorm.service";

@Module({
  imports: [S3Module],
  controllers: [ScormController],
  providers: [ScormService],
  exports: [ScormService],
})
export class ScormModule {}
