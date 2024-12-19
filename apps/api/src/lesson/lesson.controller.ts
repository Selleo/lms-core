import { Body, Controller, Delete, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, UUIDSchema, type UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { AdminLessonService } from "./adminLesson.service";
import {
  CreateLessonBody,
  createLessonSchema,
  CreateQuizLessonBody,
  createQuizLessonSchema,
  UpdateLessonBody,
  updateLessonSchema,
  UpdateQuizLessonBody,
  updateQuizLessonSchema,
} from "./lesson.schema";

// import {
//   BetaFileLessonType,
//   betaFileSelectSchema,
//   betaTextLessonSchema,
//   BetaTextLessonType,
//   type FileInsertType,
//   fileUpdateSchema,
//   type GetAllLessonItemsResponse,
//   GetAllLessonItemsResponseSchema,
//   type GetSingleLessonItemsResponse,
//   GetSingleLessonItemsResponseSchema,
//   type QuestionInsertType,
//   questionUpdateSchema,
//   type TextBlockInsertType,
//   textBlockUpdateSchema,
//   type UpdateFileBody,
//   type UpdateQuestionBody,
//   type UpdateTextBlockBody,
// } from "./schemas/lessonItem.schema";
// import {
//   type LessonsFilterSchema,
//   sortLessonFieldsOptions,
//   type SortLessonFieldsOptions,
// } from "./schemas/lessonQuery";

@Controller("lesson")
@UseGuards(RolesGuard)
export class LessonController {
  constructor(
    // private readonly chapterService: CService,
    private readonly adminLessonsService: AdminLessonService, // private readonly adminLessonItemsService: AdminLessonItemsService,
  ) {}

  //   @Get("lesson/:id")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     response: baseResponse(showLessonSchema),
  //   })
  //   async getLessonById(@Param("id") id: string): Promise<BaseResponse<ShowLessonResponse>> {
  //     return new BaseResponse(await this.adminLessonsService.getLessonWithItemsById(id));
  //   }

  @Post("beta-create-lesson")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: createLessonSchema,
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async betaCreateLesson(
    @Body() createLessonBody: CreateLessonBody,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const id = await this.adminLessonsService.createLessonForChapter(createLessonBody, userId);

    return new BaseResponse({ id, message: "Lesson created successfully" });
  }

  @Post("beta-create-lesson/quiz")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: createQuizLessonSchema,
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async betaCreateQuizLesson(
    @Body() createQuizLessonBody: CreateQuizLessonBody,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const id = await this.adminLessonsService.createQuizLesson(createQuizLessonBody, userId);

    return new BaseResponse({ id, message: "Lesson created successfully" }) as any;
  }

  @Patch("beta-update-lesson/quiz")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "query",
        name: "id",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: updateQuizLessonSchema,
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async betaUpdateQuizLesson(
    @Query("id") id: string,
    @Body() data: UpdateQuizLessonBody,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonsService.updateQuizLesson(id, data, userId);
    return new BaseResponse({ message: "Text block updated successfully" });
  }

  @Patch("beta-update-lesson")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "query",
        name: "id",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: updateLessonSchema,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async betaUpdateLesson(
    @Query("id") id: string,
    @Body() data: UpdateLessonBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonsService.updateLesson(id, data);
    return new BaseResponse({ message: "Text block updated successfully" });
  }

  @Delete()
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [{ type: "query", name: "lessonId", schema: UUIDSchema, required: true }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async removeLesson(
    @Query("lessonId") lessonId: UUIDType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonsService.removeLesson(lessonId);

    return new BaseResponse({
      message: "Lesson removed from course successfully",
    });
  }

  //   @Patch("course-lesson")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           courseId: UUIDSchema,
  //           lessonId: UUIDSchema,
  //           isFree: Type.Boolean(),
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ isFree: Type.Boolean(), message: Type.String() })),
  //   })
  //   async toggleLessonAsFree(
  //     @Body() body: { courseId: string; lessonId: string; isFree: boolean },
  //   ): Promise<BaseResponse<{ isFree: boolean; message: string }>> {
  //     const [toggledLesson] = await this.adminLessonsService.toggleLessonAsFree(
  //       body.courseId,
  //       body.lessonId,
  //       body.isFree,
  //     );
  //     return new BaseResponse({
  //       isFree: toggledLesson.isFree,
  //       message: body.isFree
  //         ? "Lesson toggled as free successfully"
  //         : "Lesson toggled as not free successfully",
  //     });
  //   }

  //   @Post("evaluation-quiz")
  //   @Roles(USER_ROLES.STUDENT)
  //   @Validate({
  //     request: [
  //       { type: "query", name: "courseId", schema: UUIDSchema },
  //       { type: "query", name: "lessonId", schema: UUIDSchema },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async evaluationQuiz(
  //     @Query("courseId") courseId: string,
  //     @Query("lessonId") lessonId: string,
  //     @CurrentUser("userId") currentUserId: UUIDType,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.lessonsService.evaluationQuiz(courseId, lessonId, currentUserId);
  //     return new BaseResponse({
  //       message: "Evaluation quiz successfully",
  //     });
  //   }

  //   @Delete("clear-quiz-progress")
  //   @Roles(USER_ROLES.STUDENT)
  //   @Validate({
  //     request: [
  //       { type: "query", name: "courseId", schema: UUIDSchema, required: true },
  //       { type: "query", name: "lessonId", schema: UUIDSchema, required: true },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async clearQuizProgress(
  //     @Query("courseId") courseId: string,
  //     @Query("lessonId") lessonId: string,
  //     @CurrentUser("userId") currentUserId: UUIDType,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     const result = await this.lessonsService.clearQuizProgress(courseId, lessonId, currentUserId);
  //     if (result)
  //       return new BaseResponse({
  //         message: "Evaluation quiz successfully",
  //       });

  //     return new BaseResponse({
  //       message: "Evaluation quiz ending in error",
  //     });
  //   }

  @Patch("lesson-display-order")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          lessonId: UUIDSchema,
          displayOrder: Type.Number(),
        }),
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateLessonDisplayOrder(
    @Body()
    body: {
      lessonId: UUIDType;
      displayOrder: number;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonsService.updateLessonDisplayOrder(body);

    return new BaseResponse({
      message: "Chapter display order updated successfully",
    });
  }
}
