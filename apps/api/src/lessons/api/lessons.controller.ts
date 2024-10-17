import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import { baseResponse, BaseResponse, UUIDSchema } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import type { UserRole } from "src/users/schemas/user-roles";
import { LessonsService } from "../lessons.service";
import {
  AllLessonsResponse,
  allLessonsSchema,
  type ShowLessonResponse,
  showLessonSchema,
} from "../schemas/lesson.schema";

@Controller("courses")
@UseGuards(RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lessons")
  @Roles("tutor", "admin")
  @Validate({
    response: baseResponse(allLessonsSchema),
  })
  async getAllLessons(): Promise<BaseResponse<AllLessonsResponse>> {
    return new BaseResponse(await this.lessonsService.getAllLessons());
  }

  @Get("available-lessons")
  @Roles("tutor", "admin")
  @Validate({
    response: baseResponse(
      Type.Array(
        Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.String(),
          imageUrl: Type.String(),
          itemsCount: Type.Number(),
        }),
      ),
    ),
  })
  async getAvailableLessons(): Promise<
    BaseResponse<
      Array<{
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        itemsCount: number;
      }>
    >
  > {
    const availableLessons = await this.lessonsService.getAvailableLessons();
    return new BaseResponse(availableLessons);
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
  @Roles("tutor", "admin")
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
  @Roles("tutor", "admin")
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
