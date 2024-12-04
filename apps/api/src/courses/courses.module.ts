import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [FilesModule],
  controllers: [CoursesController],
  providers: [CoursesService, LessonsRepository],
  exports: [],
})
export class CoursesModule {}
