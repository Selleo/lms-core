import { Controller, Get, UseGuards } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { TeacherStatsSchema, UserStatsSchema } from "./schemas/userStats.schema";
import { StatisticsService } from "./statistics.service";

import type { TeacherStats, UserStats } from "./schemas/userStats.schema";

@UseGuards(RolesGuard)
@Controller("statistics")
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get("user-stats")
  @Validate({
    response: baseResponse(UserStatsSchema),
  })
  async getUserStatistics(
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<UserStats>> {
    return new BaseResponse(await this.statisticsService.getUserStats(currentUserId));
  }

  @Get("teacher-stats")
  @Roles(USER_ROLES.admin, USER_ROLES.tutor)
  @Validate({
    response: baseResponse(TeacherStatsSchema),
  })
  async getTeacherStats(
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<TeacherStats>> {
    return new BaseResponse(await this.statisticsService.getTeacherStats(currentUserId));
  }
}
