import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { StatisticsController } from "./api/statistics.controller";
import { StatisticsHandler } from "./handlers/statistics.handler";
import { StatisticsRepository } from "./repositories/statistics.repository";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [CqrsModule],
  controllers: [StatisticsController],
  providers: [StatisticsHandler, StatisticsRepository, StatisticsService],
  exports: [StatisticsRepository],
})
export class StatisticsModule {}
