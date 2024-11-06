import { Controller, Post, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import { UUIDSchema, baseResponse, BaseResponse } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";

import { StudentCompletedLessonItemsService } from "../studentCompletedLessonItems.service";

@Controller("studentCompletedLessonItems")
export class StudentCompletedLessonItemsController {
  constructor(
    private readonly studentCompletedLessonItemsService: StudentCompletedLessonItemsService,
  ) {}

  @Post()
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
    @Query("id") id: string,
    @Query("lessonId") lessonId: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.studentCompletedLessonItemsService.markLessonItemAsCompleted(
      id,
      lessonId,
      currentUser.userId,
    );

    return new BaseResponse({ message: "Lesson item marked as completed" });
  }
}
