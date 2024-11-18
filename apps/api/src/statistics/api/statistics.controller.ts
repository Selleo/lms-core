import { Controller, Get } from "@nestjs/common";

import { BaseResponse, UUIDType } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";

import { StatisticsService } from "../statistics.service";

@Controller("statistics")
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  async getUserStatistics(@CurrentUser("userId") currentUserId: UUIDType) {
    return new BaseResponse(await this.statisticsService.getUserStats(currentUserId));
  }
}
