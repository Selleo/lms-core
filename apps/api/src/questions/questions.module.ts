import { Module } from "@nestjs/common";
import { QuestionsController } from "./api/questions.controller";
import { QuestionsService } from "./questions.service";
import { StudentCompletedLessonItemsService } from "src/studentCompletedLessonItem/studentCompletedLessonItems.service";

@Module({
  imports: [],
  controllers: [QuestionsController],
  providers: [QuestionsService, StudentCompletedLessonItemsService],
  exports: [],
})
export class QuestionsModule {}
