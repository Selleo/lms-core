import { Module } from "@nestjs/common";

import { S3Service } from "src/file/s3.service";
import { LessonsModule } from "src/lessons/lessons.module";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [LessonsModule],
  controllers: [CoursesController],
  providers: [CoursesService, S3Service, LessonsRepository, StatisticsRepository],
  exports: [],
})
export class CoursesModule {}
