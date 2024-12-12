import { Module } from "@nestjs/common";

import { LessonModule } from "src/lesson/lesson.module";
import { StatisticsModule } from "src/statistics/statistics.module";
import { StudentLessonProgressModule } from "src/studentLessonProgress/studentLessonProgress.module";

import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { QuestionsRepository } from "./questions.repository";

@Module({
  imports: [LessonModule, StudentLessonProgressModule, StatisticsModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionsRepository],
  exports: [],
})
export class QuestionsModule {}
