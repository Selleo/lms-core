import { S3Service } from "src/file/s3.service";
import { CoursesController } from "./api/courses.controller";
import { CoursesService } from "./courses.service";
import { Module } from "@nestjs/common";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService, S3Service, LessonsRepository],
  exports: [],
})
export class CoursesModule {}
