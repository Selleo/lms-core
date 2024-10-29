import { Module } from "@nestjs/common";
import { QuestionsController } from "./api/questions.controller";
import { QuestionsService } from "./questions.service";
import { StudentCompletedLessonItemsService } from "src/studentCompletedLessonItem/studentCompletedLessonItems.service";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";

@Module({
  imports: [],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    StudentCompletedLessonItemsService,
    LessonsRepository,
  ],
  exports: [],
})
export class QuestionsModule {}
