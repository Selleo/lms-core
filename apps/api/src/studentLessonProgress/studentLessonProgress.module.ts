import { Module } from "@nestjs/common";

import { StatisticsModule } from "src/statistics/statistics.module";
import { StudentLessonProgressService } from "./studentLessonProgress.service";
import { StudentLessonProgressController } from "./studentLessonProgress.controller";

@Module({
  imports: [StatisticsModule],
  controllers: [StudentLessonProgressController],
  providers: [StudentLessonProgressService],
  exports: [StudentLessonProgressService],
})
export class StudentLessonProgressModule {}
