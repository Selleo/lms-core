import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";

import { AdminLessonRepository } from "./adminLesson.repository";
import { AdminLessonService } from "./adminLesson.service";
import { LessonController } from "./lesson.controller";
import { LessonRepository } from "./lesson.repository";

@Module({
  imports: [FileModule],
  controllers: [LessonController],
  providers: [LessonRepository, AdminLessonService, AdminLessonRepository],
  exports: [AdminLessonService, AdminLessonRepository, LessonRepository],
})
export class LessonModule {}
