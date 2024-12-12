import { Module } from "@nestjs/common";

import { StatisticsModule } from "src/statistics/statistics.module";

import { StudentLessonProgressController } from "./studentLessonProgress.controller";
import { StudentLessonProgressService } from "./studentLessonProgress.service";

@Module({
  imports: [StatisticsModule],
  controllers: [StudentLessonProgressController],
  providers: [StudentLessonProgressService],
  exports: [StudentLessonProgressService],
})
export class StudentLessonProgressModule {}
