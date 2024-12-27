import { Controller, Post, Query, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, UUIDSchema, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { StudentLessonProgressService } from "./studentLessonProgress.service";

@UseGuards(RolesGuard)
@Controller("studentLessonProgress")
export class StudentLessonProgressController {
  constructor(private readonly studentLessonProgressService: StudentLessonProgressService) {}

  @Post()
  @Roles(USER_ROLES.STUDENT)
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async markLessonAsCompleted(
    @Query("id") id: UUIDType,
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.studentLessonProgressService.markLessonAsCompleted(id, currentUserId);

    return new BaseResponse({ message: "Lesson item marked as completed" });
  }
}
