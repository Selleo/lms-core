import { Module } from "@nestjs/common";

import { StatisticsModule } from "src/statistics/statistics.module";

import { QuestionController } from "./question.controller";
import { QuestionsRepository } from "./questions.repository";
import { QuestionService } from "./question.service";
import { LessonModule } from "src/lesson/lesson.module";
import { StudentLessonProgressModule } from "src/studentLessonProgress/studentLessonProgress.module";

@Module({
  imports: [LessonModule, StudentLessonProgressModule, StatisticsModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionsRepository],
  exports: [],
})
export class QuestionsModule {}
