import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";
import { LessonsModule } from "src/lessons/lessons.module";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { S3Service } from "src/s3/s3.service";
import { StatisticsModule } from "src/statistics/statistics.module";

import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [FilesModule, StatisticsModule, LessonsModule],
  controllers: [CoursesController],
  providers: [CoursesService, S3Service, LessonsRepository],
  exports: [],
})
export class CoursesModule {}
