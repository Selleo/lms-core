import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  paginatedResponse,
  PaginatedResponse,
  UUIDSchema,
  type UUIDType,
} from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES, UserRole } from "src/users/schemas/user-roles";

import { AdminLessonItemsService } from "../adminLessonItems.service";
import { AdminLessonsService } from "../adminLessons.service";
import { LessonsService } from "../lessons.service";
import {
  type AllLessonsResponse,
  allLessonsSchema,
  type CreateLessonBody,
  createLessonSchema,
  type ShowLessonResponse,
  showLessonSchema,
  type UpdateLessonBody,
  updateLessonSchema,
} from "../schemas/lesson.schema";
import {
  type FileInsertType,
  fileUpdateSchema,
  type GetAllLessonItemsResponse,
  GetAllLessonItemsResponseSchema,
  type GetSingleLessonItemsResponse,
  GetSingleLessonItemsResponseSchema,
  type QuestionInsertType,
  questionUpdateSchema,
  type TextBlockInsertType,
  textBlockUpdateSchema,
  type UpdateFileBody,
  type UpdateQuestionBody,
  type UpdateTextBlockBody,
} from "../schemas/lessonItem.schema";
import {
  type LessonsFilterSchema,
  sortLessonFieldsOptions,
  type SortLessonFieldsOptions,
} from "../schemas/lessonQuery";

@Controller("lessons")
@UseGuards(RolesGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly adminLessonsService: AdminLessonsService,
    private readonly adminLessonItemsService: AdminLessonItemsService,
  ) {}

  @Get()
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    response: paginatedResponse(allLessonsSchema),
    request: [
      { type: "query", name: "title", schema: Type.Optional(Type.String()) },
      { type: "query", name: "state", schema: Type.Optional(Type.String()) },
      { type: "query", name: "sort", schema: sortLessonFieldsOptions },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "archived", schema: Type.Optional(Type.String()) },
    ],
  })
  async getAllLessons(
    @Query("title") title: string,
    @Query("state") state: string,
    @Query("sort") sort: SortLessonFieldsOptions,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("archived") archived?: string,
  ): Promise<PaginatedResponse<AllLessonsResponse>> {
    const filters: LessonsFilterSchema = {
      title,
      state,
      archived: archived === "true",
    };

    const query = { filters, sort, page, perPage };

    return new PaginatedResponse(await this.adminLessonsService.getAllLessons(query));
  }

  @Get("available-lessons")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
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
    const availableLessons = await this.adminLessonsService.getAvailableLessons();
    return new BaseResponse(availableLessons);
  }

  @Get("lesson")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
    response: baseResponse(showLessonSchema),
  })
  async getLesson(
    @Query("id") id: UUIDType,
    @Query("courseId") courseId: UUIDType,
    @CurrentUser("role") userRole: UserRole,
    @CurrentUser("userId") userId: UUIDType,
  ): Promise<BaseResponse<ShowLessonResponse>> {
    return new BaseResponse(
      await this.lessonsService.getLesson(id, courseId, userId, userRole === USER_ROLES.admin),
    );
  }

  @Get("lesson/:id")
  @Validate({
    response: baseResponse(showLessonSchema),
  })
  async getLessonById(@Param("id") id: string): Promise<BaseResponse<ShowLessonResponse>> {
    return new BaseResponse(await this.adminLessonsService.getLessonById(id));
  }

  @Post("create-lesson")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: createLessonSchema,
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async createLesson(
    @Body() createLessonBody: CreateLessonBody,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.adminLessonsService.createLesson(createLessonBody, userId);

    return new BaseResponse({ id, message: "Lesson created successfully" });
  }

  @Patch("lesson")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
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
  async updateLesson(
    @Query() id: UUIDType,
    @Body() body: UpdateLessonBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonsService.updateLesson(id, body);
    return new BaseResponse({ message: "Text block updated successfully" });
  }

  @Post("add")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
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
    await this.adminLessonsService.addLessonToCourse(
      body.courseId,
      body.lessonId,
      body.displayOrder,
    );
    return new BaseResponse({ message: "Lesson added to course successfully" });
  }

  @Delete(":courseId/:lessonId")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
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
    await this.adminLessonsService.removeLessonFromCourse(courseId, lessonId);
    return new BaseResponse({
      message: "Lesson removed from course successfully",
    });
  }

  @Post("evaluation-quiz")
  @Validate({
    request: [{ type: "query", name: "lessonId", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async evaluationQuiz(
    @Query("lessonId") lessonId: string,
    @Query("courseId") courseId: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonsService.evaluationQuiz(courseId, lessonId, currentUserId);
    return new BaseResponse({
      message: "Evaluation quiz successfully",
    });
  }

  @Delete("clear-quiz-progress")
  @Validate({
    request: [{ type: "query", name: "lessonId", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async clearQuizProgress(
    @Query("courseId") courseId: string,
    @Query("lessonId") lessonId: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    const result = await this.lessonsService.clearQuizProgress(courseId, lessonId, currentUserId);
    if (result)
      return new BaseResponse({
        message: "Evaluation quiz successfully",
      });

    return new BaseResponse({
      message: "Evaluation quiz ending in error",
    });
  }

  @Get("lesson-items")
  @Validate({
    request: [
      {
        type: "query",
        name: "type",
        schema: Type.Union([
          Type.Literal("text_block"),
          Type.Literal("question"),
          Type.Literal("file"),
        ]),
      },
      { type: "query", name: "title", schema: Type.String() },
      { type: "query", name: "state", schema: Type.String() },
      { type: "query", name: "archived", schema: Type.String() },
      { type: "query", name: "sort", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
    ],
    response: paginatedResponse(GetAllLessonItemsResponseSchema),
  })
  async getAllLessonItems(
    @Query("type") type: "text_block" | "question" | "file",
    @Query("title") title: string,
    @Query("state") state: string,
    @Query("archived") archived: string,
    @Query("sort") sort: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
  ): Promise<PaginatedResponse<GetAllLessonItemsResponse>> {
    const query = {
      type,
      title,
      state,
      archived: archived === "true",
      sort,
      page,
      perPage,
    };

    const allLessonItems = await this.adminLessonItemsService.getAllLessonItems(query);
    return new PaginatedResponse(allLessonItems);
  }

  @Get("available-lesson-items")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "query",
        name: "type",
        schema: Type.Union([
          Type.Literal("text_block"),
          Type.Literal("question"),
          Type.Literal("file"),
        ]),
      },
    ],
    response: baseResponse(GetAllLessonItemsResponseSchema),
  })
  async getAvailableLessonItems(): Promise<BaseResponse<GetAllLessonItemsResponse>> {
    const availableLessonItems = await this.adminLessonItemsService.getAvailableLessonItems();
    return new BaseResponse(availableLessonItems);
  }

  @Get("lesson-items/:id")
  @Validate({
    response: baseResponse(GetSingleLessonItemsResponseSchema),
  })
  async getLessonItemById(
    @Param("id") id: string,
  ): Promise<BaseResponse<GetSingleLessonItemsResponse>> {
    const lessonItem = await this.adminLessonItemsService.getLessonItemById(id);
    return new BaseResponse(lessonItem);
  }

  @Post(":lessonId/assign-items")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      { type: "param", name: "lessonId", schema: UUIDSchema },
      {
        type: "body",
        schema: Type.Object({
          items: Type.Array(
            Type.Object({
              id: UUIDSchema,
              type: Type.Union([
                Type.Literal("text_block"),
                Type.Literal("file"),
                Type.Literal("question"),
              ]),
            }),
          ),
        }),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async assignItemsToLesson(
    @Param("lessonId") lessonId: string,
    @Body()
    body: {
      items: Array<{
        id: string;
        type: "text_block" | "file" | "question";
        displayOrder: number;
      }>;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.assignItemsToLesson(lessonId, body.items);
    return new BaseResponse({
      message: "Successfully assigned items to lesson",
    });
  }

  @Post(":lessonId/unassign-items")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      { type: "param", name: "lessonId", schema: UUIDSchema },
      {
        type: "body",
        schema: Type.Object({
          items: Type.Array(
            Type.Object({
              id: UUIDSchema,
              type: Type.Union([
                Type.Literal("text_block"),
                Type.Literal("file"),
                Type.Literal("question"),
              ]),
            }),
          ),
        }),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async unassignItemsFromLesson(
    @Param("lessonId") lessonId: string,
    @Body()
    body: {
      items: Array<{ id: string; type: "text_block" | "file" | "question" }>;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.unassignItemsFromLesson(lessonId, body.items);
    return new BaseResponse({
      message: "Successfully unassigned items from lesson",
    });
  }

  @Patch("text-block-item")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "query",
        name: "id",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: textBlockUpdateSchema,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateTextBlockItem(
    @Query() id: UUIDType,
    @Body() body: UpdateTextBlockBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.updateTextBlockItem(id, body);
    return new BaseResponse({ message: "Text block updated successfully" });
  }

  @Patch("question-item")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "query",
        name: "id",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: questionUpdateSchema,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateQuestionItem(
    @Query() id: UUIDType,
    @Body() body: UpdateQuestionBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.updateQuestionItem(id, body);
    return new BaseResponse({ message: "Question updated successfully" });
  }

  @Patch("file-item")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "query",
        name: "id",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: fileUpdateSchema,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateFileItem(
    @Query() id: UUIDType,
    @Body() body: UpdateFileBody,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.updateFileItem(id, body);

    return new BaseResponse({ message: "File updated successfully" });
  }

  @Post("create-text-block")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          title: Type.String(),
          body: Type.String(),
          state: Type.String(),
          authorId: UUIDSchema,
        }),
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async createTextBlock(
    @Body() body: TextBlockInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.adminLessonItemsService.createTextBlock(body, userId);

    return new BaseResponse({ id, message: "Text block created successfully" });
  }

  @Post("create-question")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          questionType: Type.String(),
          questionBody: Type.String(),
          state: Type.String(),
          authorId: UUIDSchema,
          solutionExplanation: Type.Optional(Type.String()),
        }),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String(), questionId: UUIDSchema })),
  })
  async createQuestion(
    @Body()
    body: QuestionInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ message: string; questionId: string }>> {
    const { id } = await this.adminLessonItemsService.createQuestion(body, userId);

    return new BaseResponse({
      questionId: id,
      message: "Question created successfully",
    });
  }

  @Get("question-options")
  @Validate({
    request: [
      {
        type: "query",
        name: "questionId",
        schema: UUIDSchema,
      },
    ],
    response: baseResponse(
      Type.Array(
        Type.Object({
          id: UUIDSchema,
          optionText: Type.String(),
          isCorrect: Type.Boolean(),
          position: Type.Union([Type.Number(), Type.Null()]),
        }),
      ),
    ),
  })
  async getQuestionAnswers(@Query("questionId") questionId: string): Promise<
    BaseResponse<
      {
        id: string;
        optionText: string;
        isCorrect: boolean;
        position: number | null;
      }[]
    >
  > {
    const options = await this.adminLessonItemsService.getQuestionAnswers(questionId);
    return new BaseResponse(options);
  }

  @Patch("question-options")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "query",
        name: "questionId",
        schema: UUIDSchema,
      },
      {
        type: "body",
        schema: Type.Array(
          Type.Partial(
            Type.Object({
              id: UUIDSchema,
              optionText: Type.String(),
              isCorrect: Type.Boolean(),
              position: Type.Number(),
            }),
          ),
        ),
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async upsertQuestionOptions(
    @Query("questionId") questionId: string,
    @Body()
    options: Array<
      Partial<{
        id: string;
        optionText: string;
        isCorrect: boolean;
        position: number;
      }>
    >,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.adminLessonItemsService.upsertQuestionOptions(questionId, options);
    return new BaseResponse({
      message: "Question options updated successfully",
    });
  }

  @Post("create-file")
  @Roles(USER_ROLES.tutor, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          title: Type.String(),
          type: Type.String(),
          url: Type.String(),
          state: Type.String(),
          authorId: UUIDSchema,
        }),
      },
    ],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async createFile(
    @Body() body: FileInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.adminLessonItemsService.createFile(body, userId);

    return new BaseResponse({ id, message: "File created successfully" });
  }
}
