import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import { baseResponse, BaseResponse, UUIDSchema } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import type { UserRole } from "src/users/schemas/user-roles";
import { LessonsService } from "../lessons.service";
import {
  AllLessonsResponse,
  allLessonsSchema,
  type ShowLessonResponse,
  showLessonSchema,
} from "../schemas/lesson.schema";

@Controller("courses")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lessons")
  @Validate({
    response: baseResponse(allLessonsSchema),
  })
  async getAllLessons(
    @CurrentUser() currentUser: { role: string },
  ): Promise<BaseResponse<AllLessonsResponse>> {
    if (currentUser.role !== "admin") {
      throw new UnauthorizedException("You don't have permission to update");
    }

    return new BaseResponse(await this.lessonsService.getAllLessons());
  }

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

  @Post("add")
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          courseId: UUIDSchema,
          lessonId: UUIDSchema,
          displayOrder: Type.Optional(Type.Number()),
        }),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async addLessonToCourse(
    @Body() body: { courseId: string; lessonId: string; displayOrder?: number },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonsService.addLessonToCourse(
      body.courseId,
      body.lessonId,
      body.displayOrder,
    );
    return new BaseResponse({ message: "Lesson added to course successfully" });
  }

  @Delete(":courseId/:lessonId")
  @Validate({
    request: [
      { type: "param", name: "courseId", schema: UUIDSchema },
      { type: "param", name: "lessonId", schema: UUIDSchema },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async removeLessonFromCourse(
    @Param("courseId") courseId: string,
    @Param("lessonId") lessonId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonsService.removeLessonFromCourse(courseId, lessonId);
    return new BaseResponse({
      message: "Lesson removed from course successfully",
    });
  }
}
