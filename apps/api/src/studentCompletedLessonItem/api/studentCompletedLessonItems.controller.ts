import { Controller, Post, Query, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { UUIDSchema, baseResponse, BaseResponse, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { StudentCompletedLessonItemsService } from "../studentCompletedLessonItems.service";

@UseGuards(RolesGuard)
@Controller("studentCompletedLessonItems")
export class StudentCompletedLessonItemsController {
  constructor(
    private readonly studentCompletedLessonItemsService: StudentCompletedLessonItemsService,
  ) {}

  @Post()
  @Roles(USER_ROLES.student)
  @Validate({
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
      {
        type: "query",
        name: "lessonId",
        schema: UUIDSchema,
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async markLessonItemAsCompleted(
    @Query("id") id: UUIDType,
    @Query("lessonId") lessonId: UUIDType,
    @Query("courseId") courseId: UUIDType,
    @CurrentUser() currentUser: { userId: UUIDType },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.studentCompletedLessonItemsService.markLessonItemAsCompleted(
      id,
      courseId,
      lessonId,
      currentUser.userId,
    );

    return new BaseResponse({ message: "Lesson item marked as completed" });
  }
}
