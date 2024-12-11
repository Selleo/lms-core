import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";
import { AdminLessonService } from "./adminLesson.service";
import { AdminLessonRepository } from "./adminLesson.repository";
import { ChapterModule } from "src/chapter/chapter.module";
import { LessonRepository } from "./lesson.repository";
import { LessonController } from "./lesson.controller";

@Module({
  imports: [FileModule],
  controllers: [LessonController],
  providers: [LessonRepository, AdminLessonService, AdminLessonRepository],
  exports: [AdminLessonService, AdminLessonRepository, LessonRepository],
})
export class LessonModule {}

