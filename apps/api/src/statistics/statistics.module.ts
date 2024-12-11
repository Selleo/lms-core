import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { LessonModule } from "src/lesson/lesson.module";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { StatisticsHandler } from "./handlers/statistics.handler";
import { StatisticsController } from "./statistics.controller";
import { StatisticsCron } from "./statistics.cron";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [CqrsModule, LessonModule],
  controllers: [StatisticsController],
  providers: [StatisticsHandler, StatisticsRepository, StatisticsService, StatisticsCron],
  exports: [StatisticsRepository],
})
export class StatisticsModule {}
