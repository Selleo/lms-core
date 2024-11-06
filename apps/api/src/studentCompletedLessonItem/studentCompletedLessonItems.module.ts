import { Module } from "@nestjs/common";

import { StudentCompletedLessonItemsController } from "./api/studentCompletedLessonItems.controller";
import { StudentCompletedLessonItemsService } from "./studentCompletedLessonItems.service";

@Module({
  imports: [],
  controllers: [StudentCompletedLessonItemsController],
  providers: [StudentCompletedLessonItemsService],
  exports: [StudentCompletedLessonItemsService],
})
export class StudentCompletedLessonItemsModule {}
