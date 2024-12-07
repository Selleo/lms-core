import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";
import { S3Service } from "src/s3/s3.service";

import { AdminLessonItemsService } from "./adminLessonItems.service";
import { AdminLessonsService } from "./adminLessons.service";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";
import { AdminLessonItemsRepository } from "./repositories/adminLessonItems.repository";
import { AdminLessonsRepository } from "./repositories/adminLessons.repository";
import { LessonsRepository } from "./repositories/lessons.repository";

@Module({
  imports: [FilesModule],
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
  exports: [LessonsRepository, AdminLessonsService, AdminLessonsRepository],
})
export class LessonsModule {}
