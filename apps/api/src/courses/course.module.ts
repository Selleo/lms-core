import { Module } from "@nestjs/common";

import { FileModule } from "src/file/files.module";
import { S3Service } from "src/s3/s3.service";
import { StatisticsModule } from "src/statistics/statistics.module";

import { CourseService } from "./course.service";
import { ChapterModule } from "src/chapter/chapter.module";
import { CourseController } from "./course.controller";

@Module({
  imports: [FileModule, StatisticsModule, ChapterModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [],
})
export class CourseModule {}
