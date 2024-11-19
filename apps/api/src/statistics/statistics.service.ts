import { Injectable } from "@nestjs/common";

import { StatisticsRepository } from "./repositories/statistics.repository";

@Injectable()
export class StatisticsService {
  constructor(private statisticsRepository: StatisticsRepository) {}

  async getUserStats(userId: string) {
    return this.statisticsRepository.getUserStats(userId);
  }
}
