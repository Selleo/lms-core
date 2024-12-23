import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";

import { LessonController } from "./lesson.controller";
import { AdminLessonRepository } from "./repositories/adminLesson.repository";
import { LessonRepository } from "./repositories/lesson.repository";
import { AdminLessonService } from "./services/adminLesson.service";
import { LessonService } from "./services/lesson.service";

@Module({
  imports: [FileModule],
  controllers: [LessonController],
  providers: [LessonRepository, AdminLessonService, AdminLessonRepository, LessonService],
  exports: [AdminLessonService, AdminLessonRepository, LessonRepository],
})
export class LessonModule {}
