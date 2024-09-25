import { Module } from "@nestjs/common";
import { StudentCompletedLessonItemsService } from "./studentCompletedLessonItems.service";
import { StudentCompletedLessonItemsController } from "./api/studentCompletedLessonItems.controller";

@Module({
  imports: [],
  controllers: [StudentCompletedLessonItemsController],
  providers: [StudentCompletedLessonItemsService],
  exports: [],
})
export class StudentCompletedLessonItemsModule {}
