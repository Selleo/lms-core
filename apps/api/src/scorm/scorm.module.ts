import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";
import { S3Module } from "src/s3/s3.module";

import { ScormRepository } from "./repositories/scorm.repository";
import { ScormController } from "./scorm.controller";
import { ScormService } from "./services/scorm.service";

@Module({
  imports: [S3Module, FileModule],
  controllers: [ScormController],
  providers: [ScormService, ScormRepository],
  exports: [ScormService],
})
export class ScormModule {}
