import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { StatisticsHandler } from "./handlers/statistics.handler";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [CqrsModule],
  controllers: [StatisticsController],
  providers: [StatisticsHandler, StatisticsRepository, StatisticsService, LessonsRepository],
  exports: [StatisticsRepository],
})
export class StatisticsModule {}
