import { Module } from "@nestjs/common";

import { S3Service } from "src/file/s3.service";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";

import { CoursesController } from "./api/courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService, S3Service, LessonsRepository],
  exports: [],
})
export class CoursesModule {}
