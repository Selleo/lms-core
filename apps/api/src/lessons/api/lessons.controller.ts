import { Controller, Get, Query } from "@nestjs/common";
import { LessonsService } from "../lessons.service";
import { baseResponse, BaseResponse } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import {
  type ShowLessonResponse,
  showLessonSchema,
} from "../schemas/lesson.schema";
import { Validate } from "nestjs-typebox";
import { Type } from "@sinclair/typebox";
import type { UserRole } from "src/users/schemas/user-roles";

@Controller("courses")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lesson")
  @Validate({
    response: baseResponse(showLessonSchema),
    request: [
      {
        type: "query",
        name: "id",
        schema: Type.String({ format: "uuid" }),
      },
    ],
  })
  async getLesson(
    @Query("id") id: string,
    @CurrentUser("role") userRole: UserRole,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<ShowLessonResponse>> {
    return new BaseResponse(
      await this.lessonsService.getLesson(
        id,
        currentUserId,
        userRole === "admin",
      ),
    );
  }
}
