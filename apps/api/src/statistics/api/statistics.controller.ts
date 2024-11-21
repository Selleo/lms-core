import { Controller, Get } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, UUIDType } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";

import { UserStatsSchema } from "../schemas/userStats.schema";
import { StatisticsService } from "../statistics.service";

import type { UserStats } from "../schemas/userStats.schema";

@Controller("statistics")
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  @Validate({
    response: baseResponse(UserStatsSchema),
  })
  async getUserStatistics(
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<UserStats>> {
    return new BaseResponse(await this.statisticsService.getUserStats(currentUserId));
  }
}
