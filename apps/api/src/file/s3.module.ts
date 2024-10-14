import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Controller } from "./api/s3.controller";

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
