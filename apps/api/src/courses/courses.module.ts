import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";
import { LessonsModule } from "src/lessons/lessons.module";
import { StatisticsModule } from "src/statistics/statistics.module";

import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [FilesModule, StatisticsModule, LessonsModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [],
})
export class CoursesModule {}
