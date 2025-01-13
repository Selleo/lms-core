import { Module } from "@nestjs/common";

import { ChapterModule } from "src/chapter/chapter.module";
import { FileModule } from "src/file/files.module";
import { LessonModule } from "src/lesson/lesson.module";
import { StatisticsModule } from "src/statistics/statistics.module";

import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";

@Module({
  imports: [FileModule, StatisticsModule, ChapterModule, LessonModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
