import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { StatisticsController } from "./api/statistics.controller";
import { StatisticsHandler } from "./handlers/statistics.handler";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [CqrsModule],
  controllers: [StatisticsController],
  providers: [StatisticsHandler, StatisticsRepository, StatisticsService, LessonsRepository],
  exports: [StatisticsRepository],
})
export class StatisticsModule {}
