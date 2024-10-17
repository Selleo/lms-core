import { Controller, Get, Post, Query } from "@nestjs/common";
import { LessonsService } from "../lessons.service";
import { baseResponse, BaseResponse, UUIDSchema } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import {
  type ShowLessonResponse,
  showLessonSchema,
} from "../schemas/lesson.schema";
import { Validate } from "nestjs-typebox";
import { Type } from "@sinclair/typebox";
import type { UserRole } from "src/users/schemas/user-roles";

@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lesson")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
    response: baseResponse(showLessonSchema),
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

  @Post("evaluation-quiz")
  @Validate({
    request: [{ type: "query", name: "lessonId", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async evaluationQuiz(
    @Query("lessonId") lessonId: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonsService.evaluationQuiz(lessonId, currentUserId);
    return new BaseResponse({
      message: "Evaluation quiz successfully",
    });
  }
}
