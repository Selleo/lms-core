import { Controller, UseGuards } from "@nestjs/common";

import { RolesGuard } from "src/common/guards/roles.guard";

import { StatisticsService } from "./statistics.service";

@UseGuards(RolesGuard)
@Controller("statistics")
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // TODO: repair this
  // @Get("user-stats")
  // @Validate({
  //   response: baseResponse(UserStatsSchema),
  // })
  // async getUserStatistics(
  //   @CurrentUser("userId") currentUserId: UUIDType,
  // ): Promise<BaseResponse<UserStats>> {
  //   return new BaseResponse(await this.statisticsService.getUserStats(currentUserId));
  // }

  // @Get("teacher-stats")
  // @Roles(USER_ROLES.ADMIN, USER_ROLES.TEACHER)
  // @Validate({
  //   response: baseResponse(TeacherStatsSchema),
  // })
  // async getTeacherStats(
  //   @CurrentUser("userId") currentUserId: UUIDType,
  // ): Promise<BaseResponse<TeacherStats>> {
  //   return new BaseResponse(await this.statisticsService.getTeacherStats(currentUserId));
  // }
}
