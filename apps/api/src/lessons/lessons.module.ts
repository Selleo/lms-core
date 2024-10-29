import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./api/lessons.controller";
import { S3Service } from "src/file/s3.service";
import { LessonItemsService } from "./lessonItems.service";
import { LessonsRepository } from "./repositories/lessons.repository";
import { AdminLessonsRepository } from "./repositories/adminLessons.repository";
import { AdminLessonsService } from "./adminLessons.service";

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [
    LessonsService,
    AdminLessonsService,
    LessonItemsService,
    S3Service,
    LessonsRepository,
    AdminLessonsRepository,
  ],
  exports: [LessonsRepository],
})
export class LessonsModule {}
