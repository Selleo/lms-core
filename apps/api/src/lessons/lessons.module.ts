import { Module } from "@nestjs/common";

import { FilesModule } from "src/file/files.module";

import { AdminLessonItemsService } from "./adminLessonItems.service";
import { AdminLessonsService } from "./adminLessons.service";
import { LessonsController } from "./api/lessons.controller";
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
    LessonsRepository,
    AdminLessonsRepository,
    AdminLessonItemsRepository,
  ],
  exports: [LessonsRepository],
})
export class LessonsModule {}
