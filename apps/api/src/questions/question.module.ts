import { Module } from "@nestjs/common";

import { StatisticsModule } from "src/statistics/statistics.module";

import { QuestionController } from "./question.controller";
import { QuestionRepository } from "./question.repository";
import { QuestionService } from "./question.service";

@Module({
  imports: [StatisticsModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionService, QuestionRepository],
})
export class QuestionsModule {}
