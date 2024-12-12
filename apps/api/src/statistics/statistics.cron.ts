import { Injectable } from "@nestjs/common";

import { StatisticsService } from "./statistics.service";

@Injectable()
export class StatisticsCron {
  constructor(private statisticsService: StatisticsService) {}

  //TODO: repair this
  // @Cron("0 0 * * *")
  // async refreshCourseStudentsStats() {
  //   await this.statisticsService.refreshCourseStudentsStats();
  // }
}
