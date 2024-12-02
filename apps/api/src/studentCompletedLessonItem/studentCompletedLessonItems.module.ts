import { Module } from "@nestjs/common";

import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { StudentCompletedLessonItemsController } from "./api/studentCompletedLessonItems.controller";
import { StudentCompletedLessonItemsService } from "./studentCompletedLessonItems.service";

@Module({
  imports: [],
  controllers: [StudentCompletedLessonItemsController],
  providers: [StudentCompletedLessonItemsService, StatisticsRepository],
  exports: [StudentCompletedLessonItemsService],
})
export class StudentCompletedLessonItemsModule {}
