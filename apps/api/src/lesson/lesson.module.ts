import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";

import { AdminLessonRepository } from "./repositories/adminLesson.repository";
import { AdminLessonService } from "./services/adminLesson.service";
import { LessonController } from "./lesson.controller";
import { LessonRepository } from "./repositories/lesson.repository";
import { LessonService } from "./services/lesson.service";

@Module({
  imports: [FileModule],
  controllers: [LessonController],
  providers: [LessonRepository, AdminLessonService, AdminLessonRepository, LessonService],
  exports: [AdminLessonService, AdminLessonRepository, LessonRepository],
})
export class LessonModule {}
