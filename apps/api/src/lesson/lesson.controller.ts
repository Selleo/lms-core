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

  //   @Get()
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     response: paginatedResponse(allLessonsSchema),
  //     request: [
  //       { type: "query", name: "title", schema: Type.Optional(Type.String()) },
  //       { type: "query", name: "state", schema: Type.Optional(Type.String()) },
  //       { type: "query", name: "sort", schema: sortLessonFieldsOptions },
  //       { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
  //       { type: "query", name: "perPage", schema: Type.Number() },
  //       { type: "query", name: "archived", schema: Type.Optional(Type.String()) },
  //     ],
  //   })
  //   async getAllLessons(
  //     @Query("title") title: string,
  //     @Query("state") state: string,
  //     @Query("sort") sort: SortLessonFieldsOptions,
  //     @Query("page") page: number,
  //     @Query("perPage") perPage: number,
  //     @Query("archived") archived: string,
  //     @CurrentUser("role") currentUserRole: UserRole,
  //     @CurrentUser("userId") currentUserId: UUIDType,
  //   ): Promise<PaginatedResponse<AllLessonsResponse>> {
  //     const filters: LessonsFilterSchema = {
  //       title,
  //       state,
  //       archived: archived === "true",
  //     };

  //     const query = { filters, sort, page, perPage, currentUserRole, currentUserId };

  //     return new PaginatedResponse(await this.adminLessonsService.getAllLessons(query));
  //   }

  //   @Get("available-lessons")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [{ type: "query", name: "courseId", schema: UUIDSchema, required: true }],
  //     response: baseResponse(Type.Array(lessonWithCountItems)),
  //   })
  //   async getAvailableLessons(
  //     @Query("courseId") courseId: UUIDType,
  //   ): Promise<BaseResponse<Array<LessonWithCountItems>>> {
  //     const availableLessons = await this.adminLessonsService.getAvailableLessons(courseId);
  //     return new BaseResponse(availableLessons);
  //   }

  //   @Get("lesson")
  //   @Roles(...Object.values(USER_ROLES))
  //   @Validate({
  //     request: [
  //       { type: "query", name: "id", schema: UUIDSchema, required: true },
  //       { type: "query", name: "courseId", schema: UUIDSchema, required: true },
  //     ],
  //     response: baseResponse(showLessonSchema),
  //   })
  //   async getLesson(
  //     @Query("id") id: UUIDType,
  //     @Query("courseId") courseId: UUIDType,
  //     @CurrentUser("role") userRole: UserRole,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<ShowLessonResponse>> {
  //     return new BaseResponse(
  //       await this.lessonsService.getLesson(id, courseId, userId, userRole === USER_ROLES.ADMIN),
  //     );
  //   }

  //   @Get("lesson/:id")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     response: baseResponse(showLessonSchema),
  //   })
  //   async getLessonById(@Param("id") id: string): Promise<BaseResponse<ShowLessonResponse>> {
  //     return new BaseResponse(await this.adminLessonsService.getLessonWithItemsById(id));
  //   }

  //   @Post("create-lesson")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: createLessonSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  //   })
  //   async createLesson(
  //     @Body() createLessonBody: CreateLessonBody,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
  //     const { id } = await this.adminLessonsService.createLesson(createLessonBody, userId);

  //     return new BaseResponse({ id, message: "Lesson created successfully" });
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

  //   @Patch("lesson")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "id",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: updateLessonSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async updateLesson(
  //     @Query() id: UUIDType,
  //     @Body() body: UpdateLessonBody,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonsService.updateLesson(id, body);
  //     return new BaseResponse({ message: "Text block updated successfully" });
  //   }

  //   @Delete(":courseId/:lessonId")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       { type: "param", name: "courseId", schema: UUIDSchema },
  //       { type: "param", name: "lessonId", schema: UUIDSchema },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async removeLessonFromCourse(
  //     @Param("courseId") courseId: string,
  //     @Param("lessonId") lessonId: string,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonsService.removeLessonFromCourse(courseId, lessonId);
  //     return new BaseResponse({
  //       message: "Lesson removed from course successfully",
  //     });
  //   }

  //   @Delete("chapter/:courseId/:chapterId")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       { type: "param", name: "courseId", schema: UUIDSchema },
  //       { type: "param", name: "chapterId", schema: UUIDSchema },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async removeChapter(
  //     @Query("courseId") courseId: UUIDType,
  //     @Query("chapterId") chapterId: UUIDType,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonsService.removeChapter(courseId, chapterId);
  //     return new BaseResponse({
  //       message: "Lesson removed from course successfully",
  //     });
  //   }

  //   @Delete("lesson/:chapterId/:lessonId")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       { type: "param", name: "chapterId", schema: UUIDSchema },
  //       { type: "param", name: "lessonId", schema: UUIDSchema },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async removeLesson(
  //     @Param("chapterId") chapterId: string,
  //     @Param("lessonId") lessonId: string,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.removeLesson(chapterId, lessonId);
  //     return new BaseResponse({
  //       message: "Lesson removed from course successfully",
  //     });
  //   }

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

  //   @Get("lesson-items")
  //   @Roles(USER_ROLES.ADMIN, USER_ROLES.TEACHER)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "type",
  //         schema: Type.Union([
  //           Type.Literal("text_block"),
  //           Type.Literal("question"),
  //           Type.Literal("file"),
  //         ]),
  //       },
  //       { type: "query", name: "title", schema: Type.String() },
  //       { type: "query", name: "state", schema: Type.String() },
  //       { type: "query", name: "archived", schema: Type.String() },
  //       { type: "query", name: "sort", schema: Type.String() },
  //       { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
  //       { type: "query", name: "perPage", schema: Type.Number() },
  //     ],
  //     response: paginatedResponse(GetAllLessonItemsResponseSchema),
  //   })
  //   async getAllLessonItems(
  //     @Query("type") type: "text_block" | "question" | "file",
  //     @Query("title") title: string,
  //     @Query("state") state: string,
  //     @Query("archived") archived: string,
  //     @Query("sort") sort: string,
  //     @Query("page") page: number,
  //     @Query("perPage") perPage: number,
  //   ): Promise<PaginatedResponse<GetAllLessonItemsResponse>> {
  //     const query = {
  //       type,
  //       title,
  //       state,
  //       archived: archived === "true",
  //       sort,
  //       page,
  //       perPage,
  //     };

  //     const allLessonItems = await this.adminLessonItemsService.getAllLessonItems(query);
  //     return new PaginatedResponse(allLessonItems);
  //   }

  //   @Get("available-lesson-items")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "type",
  //         schema: Type.Union([
  //           Type.Literal("text_block"),
  //           Type.Literal("question"),
  //           Type.Literal("file"),
  //         ]),
  //       },
  //     ],
  //     response: baseResponse(GetAllLessonItemsResponseSchema),
  //   })
  //   async getAvailableLessonItems(): Promise<BaseResponse<GetAllLessonItemsResponse>> {
  //     const availableLessonItems = await this.adminLessonItemsService.getAvailableLessonItems();
  //     return new BaseResponse(availableLessonItems);
  //   }

  //   @Get("lesson-items/:id")
  //   @Roles(USER_ROLES.ADMIN, USER_ROLES.TEACHER)
  //   @Validate({
  //     response: baseResponse(GetSingleLessonItemsResponseSchema),
  //   })
  //   async getLessonItemById(
  //     @Param("id") id: string,
  //   ): Promise<BaseResponse<GetSingleLessonItemsResponse>> {
  //     const lessonItem = await this.adminLessonItemsService.getLessonItemById(id);
  //     return new BaseResponse(lessonItem);
  //   }

  //   @Post(":lessonId/assign-items")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       { type: "param", name: "lessonId", schema: UUIDSchema },
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           items: Type.Array(
  //             Type.Object({
  //               id: UUIDSchema,
  //               type: Type.Union([
  //                 Type.Literal("text_block"),
  //                 Type.Literal("file"),
  //                 Type.Literal("question"),
  //               ]),
  //             }),
  //           ),
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async assignItemsToLesson(
  //     @Param("lessonId") lessonId: string,
  //     @Body()
  //     body: {
  //       items: Array<{
  //         id: string;
  //         type: "text_block" | "file" | "question";
  //         displayOrder: number;
  //       }>;
  //     },
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.assignItemsToLesson(lessonId, body.items);
  //     return new BaseResponse({
  //       message: "Successfully assigned items to lesson",
  //     });
  //   }

  //   @Post(":lessonId/unassign-items")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       { type: "param", name: "lessonId", schema: UUIDSchema },
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           items: Type.Array(
  //             Type.Object({
  //               id: UUIDSchema,
  //               type: Type.Union([
  //                 Type.Literal("text_block"),
  //                 Type.Literal("file"),
  //                 Type.Literal("question"),
  //               ]),
  //             }),
  //           ),
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async unassignItemsFromLesson(
  //     @Param("lessonId") lessonId: string,
  //     @Body()
  //     body: {
  //       items: Array<{ id: string; type: "text_block" | "file" | "question" }>;
  //     },
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.unassignItemsFromLesson(lessonId, body.items);
  //     return new BaseResponse({
  //       message: "Successfully unassigned items from lesson",
  //     });
  //   }

  //   @Patch("text-block-item")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "id",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: textBlockUpdateSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async updateTextBlockItem(
  //     @Query() id: UUIDType,
  //     @Body() body: UpdateTextBlockBody,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.updateTextBlockItem(id, body);
  //     return new BaseResponse({ message: "Text block updated successfully" });
  //   }

  //   @Patch("question-item")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "id",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: questionUpdateSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async updateQuestionItem(
  //     @Query() id: UUIDType,
  //     @Body() body: UpdateQuestionBody,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.updateQuestionItem(id, body);
  //     return new BaseResponse({ message: "Question updated successfully" });
  //   }

  //   @Patch("file-item")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "id",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: fileUpdateSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async updateFileItem(
  //     @Query() id: UUIDType,
  //     @Body() body: UpdateFileBody,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.updateFileItem(id, body);

  //     return new BaseResponse({ message: "File updated successfully" });
  //   }

  //   @Post("create-text-block")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           title: Type.String(),
  //           body: Type.String(),
  //           state: Type.String(),
  //           authorId: UUIDSchema,
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  //   })
  //   async createTextBlock(
  //     @Body() body: TextBlockInsertType,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
  //     const { id } = await this.adminLessonItemsService.createTextBlock(body, userId);

  //     return new BaseResponse({ id, message: "Text block created successfully" });
  //   }

  //   @Post("create-beta-text-block")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: betaTextLessonSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  //   })
  //   async createBetaTextBlock(
  //     @Body() body: BetaTextLessonType,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
  //     const { id } = await this.adminLessonItemsService.createTextBlockAndAssignToLesson(
  //       body,
  //       userId,
  //     );

  //     return new BaseResponse({ id, message: "Text block created successfully" });
  //   }

  //   @Post("create-question")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           questionType: Type.String(),
  //           questionBody: Type.String(),
  //           state: Type.String(),
  //           authorId: UUIDSchema,
  //           solutionExplanation: Type.Optional(Type.String()),
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String(), questionId: UUIDSchema })),
  //   })
  //   async createQuestion(
  //     @Body()
  //     body: QuestionInsertType,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ message: string; questionId: string }>> {
  //     const { id } = await this.adminLessonItemsService.createQuestion(body, userId);

  //     return new BaseResponse({
  //       questionId: id,
  //       message: "Question created successfully",
  //     });
  //   }

  //   @Get("question-options")
  //   @Roles(USER_ROLES.ADMIN, USER_ROLES.TEACHER)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "questionId",
  //         schema: UUIDSchema,
  //       },
  //     ],
  //     response: baseResponse(
  //       Type.Array(
  //         Type.Object({
  //           id: UUIDSchema,
  //           optionText: Type.String(),
  //           isCorrect: Type.Boolean(),
  //           position: Type.Union([Type.Number(), Type.Null()]),
  //         }),
  //       ),
  //     ),
  //   })
  //   async getQuestionAnswers(@Query("questionId") questionId: string): Promise<
  //     BaseResponse<
  //       {
  //         id: string;
  //         optionText: string;
  //         isCorrect: boolean;
  //         position: number | null;
  //       }[]
  //     >
  //   > {
  //     const options = await this.adminLessonItemsService.getQuestionAnswers(questionId);
  //     return new BaseResponse(options);
  //   }

  //   @Patch("question-options")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "questionId",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: Type.Array(
  //           Type.Partial(
  //             Type.Object({
  //               id: UUIDSchema,
  //               optionText: Type.String(),
  //               isCorrect: Type.Boolean(),
  //               position: Type.Number(),
  //             }),
  //           ),
  //         ),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async upsertQuestionOptions(
  //     @Query("questionId") questionId: string,
  //     @Body()
  //     options: Array<
  //       Partial<{
  //         id: string;
  //         optionText: string;
  //         isCorrect: boolean;
  //         position: number;
  //       }>
  //     >,
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.upsertQuestionOptions(questionId, options);
  //     return new BaseResponse({
  //       message: "Question options updated successfully",
  //     });
  //   }

  //   @Patch("course-lesson/freemium-status")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "query",
  //         name: "lessonId",
  //         schema: UUIDSchema,
  //       },
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           isFreemium: Type.Boolean(),
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ message: Type.String() })),
  //   })
  //   async updateLessonFreemiumStatus(
  //     @Query("lessonId") lessonId: string,
  //     @Body() body: { isFreemium: boolean },
  //   ): Promise<BaseResponse<{ message: string }>> {
  //     await this.adminLessonItemsService.updateFreemiumStatus(lessonId, body.isFreemium);
  //     return new BaseResponse({
  //       message: "Course lesson free status updated successfully",
  //     });
  //   }

  //   @Post("create-file")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: Type.Object({
  //           title: Type.String(),
  //           type: Type.String(),
  //           url: Type.String(),
  //           state: Type.String(),
  //           authorId: UUIDSchema,
  //         }),
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  //   })
  //   async createFile(
  //     @Body() body: FileInsertType,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
  //     const { id } = await this.adminLessonItemsService.createFile(body, userId);

  //     return new BaseResponse({ id, message: "File created successfully" });
  //   }

  //   @Post("beta-create-file")
  //   @Roles(USER_ROLES.TEACHER, USER_ROLES.ADMIN)
  //   @Validate({
  //     request: [
  //       {
  //         type: "body",
  //         schema: betaFileSelectSchema,
  //       },
  //     ],
  //     response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  //   })
  //   async betaCreateFile(
  //     @Body() body: BetaFileLessonType,
  //     @CurrentUser("userId") userId: UUIDType,
  //   ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
  //     const { id } = await this.adminLessonItemsService.createFileAndAssignToLesson(body, userId);

  //     return new BaseResponse({ id, message: "File created successfully" });
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
