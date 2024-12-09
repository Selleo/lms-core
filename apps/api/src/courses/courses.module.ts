import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";
import { LessonsModule } from "src/lessons/lessons.module";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsModule } from "src/statistics/statistics.module";

import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [FilesModule, StatisticsModule, LessonsModule],
  controllers: [CoursesController],
  providers: [CoursesService, LessonsRepository],
  exports: [],
})
export class CoursesModule {}
