import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse, UUIDSchema, type UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES, type UserRole } from "src/user/schemas/userRoles";

import { AdminChapterService } from "./adminChapter.service";
import { ChapterService } from "./chapter.service";
import {
  CreateChapterBody,
  createChapterSchema,
  showChapterSchema,
  UpdateChapterBody,
  updateChapterSchema,
} from "./schemas/chapter.schema";

import type { ChapterResponse } from "./schemas/chapter.schema";

@Controller("chapter")
@UseGuards(RolesGuard)
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly adminChapterService: AdminChapterService,
  ) {}

  @Get()
  @Roles(...Object.values(USER_ROLES))
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(showChapterSchema),
  })
  async getChapterWithLesson(
    @Query("id") id: UUIDType,
    @CurrentUser("role") userRole: UserRole,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<ChapterResponse>> {
    return new BaseResponse(
      await this.chapterService.getChapterWithLessons(id, userId, userRole === USER_ROLES.ADMIN),
    );
  }

  // @Get("lesson/:id")
  // @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  // @Validate({
  //   response: baseResponse(showLessonSchema),
  // })
  // async getLessonById(@Param("id") id: string): Promise<BaseResponse<ShowLessonResponse>> {
  //   return new BaseResponse(await this.adminLessonsService.getLessonWithItemsById(id));
  // }

  // @Get()
  // @Validate({
  //   response: baseResponse(chapterSchema),
  //   request: [{ type: "query", name: "id", schema: UUIDSchema }],
  // })
  // async getChapterWithLessons(
  //   @Query("id") id: UUIDType,
  //   @CurrentUser("userId") currentUserId: UUIDType,
  //   @CurrentUser("role") currentUserRole: UserRole,
  // ): Promise<BaseResponse<ChapterWithLessonsResponse>> {
  //   const data = await this.chapterService.getChapterWithDetails(
  //     id,
  //     currentUserId,
  //     currentUserRole === USER_ROLES.STUDENT,
  //   );
  //   return new BaseResponse(data);
  // }

  @Post("beta-create-chapter")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: createChapterSchema,
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async betaCreateChapter(
    @Body() createChapterBody: CreateChapterBody,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.adminChapterService.createChapterForCourse(createChapterBody, userId);

    return new BaseResponse({ id, message: "Chapter created successfully" });
  }

  @Patch()
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
        schema: updateChapterSchema,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateChapter(
    @Query("id") id: UUIDType,
    @Body() updateChapterBody: UpdateChapterBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminChapterService.updateChapter(id, updateChapterBody);

    return new BaseResponse({ message: "Chapter updated successfully" });
  }

  @Patch("chapter-display-order")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          chapterId: UUIDSchema,
          displayOrder: Type.Number(),
        }),
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateChapterDisplayOrder(
    @Body()
    body: {
      chapterId: UUIDType;
      displayOrder: number;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminChapterService.updateChapterDisplayOrder(body);

    return new BaseResponse({
      message: "Chapter display order updated successfully",
    });
  }

  // @Patch("lesson")
  // @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  // @Validate({
  //   request: [
  //     {
  //       type: "query",
  //       name: "id",
  //       schema: UUIDSchema,
  //     },
  //     {
  //       type: "body",
  //       schema: updateLessonSchema,
  //     },
  //   ],
  //   response: baseResponse(Type.Object({ message: Type.String() })),
  // })
  // async updateLesson(
  //   @Query() id: UUIDType,
  //   @Body() body: UpdateLessonBody,
  // ): Promise<BaseResponse<{ message: string }>> {
  //   await this.adminLessonsService.updateLesson(id, body);
  //   return new BaseResponse({ message: "Text block updated successfully" });
  // }

  // @Delete(":courseId/:lessonId")
  // @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  // @Validate({
  //   request: [
  //     { type: "param", name: "courseId", schema: UUIDSchema },
  //     { type: "param", name: "lessonId", schema: UUIDSchema },
  //   ],
  //   response: baseResponse(Type.Object({ message: Type.String() })),
  // })
  // async removeLessonFromCourse(
  //   @Param("courseId") courseId: string,
  //   @Param("lessonId") lessonId: string,
  // ): Promise<BaseResponse<{ message: string }>> {
  //   await this.adminLessonsService.removeLessonFromCourse(courseId, lessonId);
  //   return new BaseResponse({
  //     message: "Lesson removed from course successfully",
  //   });
  // }
  @Delete()
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [{ type: "query", name: "chapterId", schema: UUIDSchema, required: true }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async removeChapter(
    @Query("chapterId") chapterId: UUIDType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminChapterService.removeChapter(chapterId);
    return new BaseResponse({
      message: "Lesson removed from course successfully",
    });
  }

  // @Post("evaluation-quiz")
  // @Roles(USER_ROLES.STUDENT)
  // @Validate({
  //   request: [
  //     { type: "query", name: "courseId", schema: UUIDSchema },
  //     { type: "query", name: "lessonId", schema: UUIDSchema },
  //   ],
  //   response: baseResponse(Type.Object({ message: Type.String() })),
  // })
  // async evaluationQuiz(
  //   @Query("courseId") courseId: string,
  //   @Query("lessonId") lessonId: string,
  //   @CurrentUser("userId") currentUserId: UUIDType,
  // ): Promise<BaseResponse<{ message: string }>> {
  //   await this.lessonsService.evaluationQuiz(courseId, lessonId, currentUserId);
  //   return new BaseResponse({
  //     message: "Evaluation quiz successfully",
  //   });
  // }

  // @Delete("clear-quiz-progress")
  // @Roles(USER_ROLES.STUDENT)
  // @Validate({
  //   request: [
  //     { type: "query", name: "courseId", schema: UUIDSchema, required: true },
  //     { type: "query", name: "lessonId", schema: UUIDSchema, required: true },
  //   ],
  //   response: baseResponse(Type.Object({ message: Type.String() })),
  // })
  // async clearQuizProgress(
  //   @Query("courseId") courseId: string,
  //   @Query("lessonId") lessonId: string,
  //   @CurrentUser("userId") currentUserId: UUIDType,
  // ): Promise<BaseResponse<{ message: string }>> {
  //   const result = await this.lessonsService.clearQuizProgress(courseId, lessonId, currentUserId);
  //   if (result)
  //     return new BaseResponse({
  //       message: "Evaluation quiz successfully",
  //     });

  //   return new BaseResponse({
  //     message: "Evaluation quiz ending in error",
  //   });
  // }

  // @Get("question-options")
  // @Roles(USER_ROLES.ADMIN, USER_ROLES.TEACHER)
  // @Validate({
  //   request: [
  //     {
  //       type: "query",
  //       name: "questionId",
  //       schema: UUIDSchema,
  //     },
  //   ],
  //   response: baseResponse(
  //     Type.Array(
  //       Type.Object({
  //         id: UUIDSchema,
  //         optionText: Type.String(),
  //         isCorrect: Type.Boolean(),
  //         position: Type.Union([Type.Number(), Type.Null()]),
  //       }),
  //     ),
  //   ),
  // })
  // async getQuestionAnswers(@Query("questionId") questionId: string): Promise<
  //   BaseResponse<
  //     {
  //       id: string;
  //       optionText: string;
  //       isCorrect: boolean;
  //       position: number | null;
  //     }[]
  //   >
  // > {
  //   const options = await this.adminLessonItemsService.getQuestionAnswers(questionId);
  //   return new BaseResponse(options);
  // }

  @Patch("freemium-status")
  @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  @Validate({
    request: [
      {
        type: "query",
        name: "chapterId",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: Type.Object({
          isFreemium: Type.Boolean(),
        }),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateFreemiumStatus(
    @Query("chapterId") chapterId: UUIDType,
    @Body() body: { isFreemium: boolean },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminChapterService.updateFreemiumStatus(chapterId, body.isFreemium);
    return new BaseResponse({
      message: "Course lesson free status updated successfully",
    });
  }
}
