import { Module } from "@nestjs/common";

import { StatisticsModule } from "src/statistics/statistics.module";

import { StudentCompletedLessonItemsController } from "./api/studentCompletedLessonItems.controller";
import { StudentCompletedLessonItemsService } from "./studentCompletedLessonItems.service";

@Module({
  imports: [StatisticsModule],
  controllers: [StudentCompletedLessonItemsController],
  providers: [StudentCompletedLessonItemsService],
  exports: [StudentCompletedLessonItemsService],
})
export class StudentCompletedLessonItemsModule {}
