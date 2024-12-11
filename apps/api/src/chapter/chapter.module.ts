import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";
import { S3Service } from "src/s3/s3.service";

import { AdminChapterRepository } from "./repositories/adminChapter.repository";
import { ChapterService } from "./chapter.service";
import { AdminChapterService } from "./adminChapter.service";
import { ChapterRepository } from "./repositories/chapter.repository";
import { ChapterController } from "./chapter.controller";
import { LessonModule } from "src/lesson/lesson.module";

@Module({
  imports: [FileModule, LessonModule],
  controllers: [ChapterController],
  providers: [ChapterService, AdminChapterService, ChapterRepository, AdminChapterRepository],
  exports: [ChapterRepository, AdminChapterService, AdminChapterRepository],
})
export class ChapterModule {}
