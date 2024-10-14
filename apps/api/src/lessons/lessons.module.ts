import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./api/lessons.controller";
import { S3Service } from "src/file/s3.service";
import { LessonItemsService } from "./lessonItems.service";

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [LessonsService, S3Service, LessonItemsService],
  exports: [],
})
export class LessonsModule {}
