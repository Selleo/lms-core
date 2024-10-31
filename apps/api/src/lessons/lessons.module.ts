import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./api/lessons.controller";
import { S3Service } from "src/file/s3.service";
import { AdminLessonItemsService } from "./adminLessonItems.service";
import { LessonsRepository } from "./repositories/lessons.repository";
import { AdminLessonsRepository } from "./repositories/adminLessons.repository";
import { AdminLessonsService } from "./adminLessons.service";
import { AdminLessonItemsRepository } from "./repositories/adminLessonItems.repository";

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [
    LessonsService,
    AdminLessonsService,
    AdminLessonItemsService,
    S3Service,
    LessonsRepository,
    AdminLessonsRepository,
    AdminLessonItemsRepository,
  ],
  exports: [LessonsRepository],
})
export class LessonsModule {}
