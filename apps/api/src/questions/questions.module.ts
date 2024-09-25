import { Module } from "@nestjs/common";
import { QuestionsController } from "./api/questions.controller";
import { QuestionsService } from "./questions.service";

@Module({
  imports: [],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [],
})
export class QuestionsModule {}
