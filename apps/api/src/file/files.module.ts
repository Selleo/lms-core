import { Module } from "@nestjs/common";

import { S3Module } from "src/s3/s3.module";

import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [S3Module],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
