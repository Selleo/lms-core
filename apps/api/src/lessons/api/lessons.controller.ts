import { Controller, Get, Query } from "@nestjs/common";
import { LessonsService } from "../lessons.service";
import { baseResponse, BaseResponse } from "../../common";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ShowLessonResponse, showLessonSchema } from "../schemas/lesson.schema";
import { Validate } from "nestjs-typebox";
import { Type } from "@sinclair/typebox";

@Controller("courses")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lesson")
  @Validate({
    response: baseResponse(showLessonSchema),
    request: [
      { type: "query", name: "id", schema: Type.String({ format: "uuid" }) },
    ],
  })
  async getLesson(
    @Query("id") id: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<ShowLessonResponse>> {
    return new BaseResponse(
      await this.lessonsService.getLesson(id, currentUserId),
    );
  }
}
