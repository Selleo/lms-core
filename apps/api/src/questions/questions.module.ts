import { Module } from "@nestjs/common";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import { StudentCompletedLessonItemsService } from "src/studentCompletedLessonItem/studentCompletedLessonItems.service";

import { QuestionsController } from "./api/questions.controller";
import { QuestionsRepository } from "./questions.repository";
import { QuestionsService } from "./questions.service";

@Module({
  imports: [],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    StudentCompletedLessonItemsService,
    QuestionsRepository,
    LessonsRepository,
    StatisticsRepository,
  ],
  exports: [],
})
export class QuestionsModule {}
