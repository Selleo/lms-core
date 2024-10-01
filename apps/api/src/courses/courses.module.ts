import { S3Service } from "src/file/s3.service";
import { CoursesController } from "./api/courses.controller";
import { CoursesService } from "./courses.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService, S3Service],
  exports: [],
})
export class CoursesModule {}
