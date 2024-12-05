import { Module } from "@nestjs/common";

import { LessonsModule } from "src/lessons/lessons.module";
import { StatisticsModule } from "src/statistics/statistics.module";
import { StudentCompletedLessonItemsModule } from "src/studentCompletedLessonItem/studentCompletedLessonItems.module";

import { QuestionsController } from "./api/questions.controller";
import { QuestionsRepository } from "./questions.repository";
import { QuestionsService } from "./questions.service";

@Module({
  imports: [LessonsModule, StudentCompletedLessonItemsModule, StatisticsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
  exports: [],
})
export class QuestionsModule {}
