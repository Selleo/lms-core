import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";

import { StatisticsController } from "./api/statistics.controller";
import { StatisticsHandler } from "./handlers/statistics.handler";
import { StatisticsRepository } from "./repositories/statistics.repository";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [CqrsModule],
  controllers: [StatisticsController],
  providers: [StatisticsHandler, StatisticsRepository, StatisticsService, LessonsRepository],
  exports: [StatisticsRepository],
})
export class StatisticsModule {}
