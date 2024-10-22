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
import { baseResponse, BaseResponse, UUIDSchema, UUIDType } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import type { UserRole } from "src/users/schemas/user-roles";
import { LessonItemsService } from "../lessonItems.service";
import { LessonsService } from "../lessons.service";
import {
  AllLessonsResponse,
  allLessonsSchema,
  type ShowLessonResponse,
  showLessonSchema,
  UpdateLessonBody,
  updateLessonSchema,
} from "../schemas/lesson.schema";
import {
  allLessonItemsSelectSchema,
  AllLessonItemsSelectType,
  FileInsertType,
  fileUpdateSchema,
  lessonItemSelectSchema,
  QuestionInsertType,
  questionUpdateSchema,
  SingleLessonItemResponse,
  TextBlockInsertType,
  textBlockUpdateSchema,
  UpdateFileBody,
  UpdateQuestionBody,
  UpdateTextBlockBody,
} from "../schemas/lessonItem.schema";

@Controller("lessons")
@UseGuards(RolesGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly lessonItemsService: LessonItemsService,
  ) {}

  @Get()
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

  @Get("lesson/:id")
  @Validate({
    response: baseResponse(showLessonSchema),
  })
  async getLessonById(
    @Param("id") id: string,
  ): Promise<BaseResponse<ShowLessonResponse>> {
    return new BaseResponse(await this.lessonsService.getLessonById(id));
  }

  @Patch("lesson")
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
    await this.lessonsService.updateLesson(id, body);
    return new BaseResponse({ message: "Text block updated successfully" });
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

  @Delete("clear-quiz-progress")
  @Validate({
    request: [{ type: "query", name: "lessonId", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async clearQuizProgress(
    @Query("lessonId") lessonId: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    const result = await this.lessonsService.clearQuizProgress(
      lessonId,
      currentUserId,
    );
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
    ],
    response: baseResponse(allLessonItemsSelectSchema),
  })
  async getAllLessonItems(
    @Query("type") type?: "text_block" | "question" | "file" | undefined,
  ): Promise<BaseResponse<AllLessonItemsSelectType>> {
    const allLessonItems =
      await this.lessonItemsService.getAllLessonItems(type);
    return new BaseResponse(allLessonItems);
  }

  @Get("available-lesson-items")
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
    response: baseResponse(allLessonItemsSelectSchema),
  })
  async getAvailableLessonItems(): Promise<
    BaseResponse<AllLessonItemsSelectType>
  > {
    const availableLessonItems =
      await this.lessonItemsService.getAvailableLessonItems();
    return new BaseResponse(availableLessonItems);
  }

  @Get("lesson-items/:id")
  @Validate({
    response: baseResponse(lessonItemSelectSchema),
  })
  async getLessonItemById(
    @Param("id") id: string,
  ): Promise<BaseResponse<SingleLessonItemResponse>> {
    const lessonItem = await this.lessonItemsService.getLessonItemById(id);
    return new BaseResponse(lessonItem);
  }

  @Post(":lessonId/assign-items")
  @Roles("tutor", "admin")
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
    await this.lessonItemsService.assignItemsToLesson(lessonId, body.items);
    return new BaseResponse({
      message: "Successfully assigned items to lesson",
    });
  }

  @Post(":lessonId/unassign-items")
  @Roles("tutor", "admin")
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
    await this.lessonItemsService.unassignItemsFromLesson(lessonId, body.items);
    return new BaseResponse({
      message: "Successfully unassigned items from lesson",
    });
  }

  @Patch("text-block-item")
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
    await this.lessonItemsService.updateTextBlockItem(id, body);
    return new BaseResponse({ message: "Text block updated successfully" });
  }

  @Patch("question-item")
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
    await this.lessonItemsService.updateQuestionItem(id, body);
    return new BaseResponse({ message: "Question updated successfully" });
  }

  @Patch("file-item")
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
    await this.lessonItemsService.updateFileItem(id, body);
    return new BaseResponse({ message: "File updated successfully" });
  }

  @Post("create-text-block")
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
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async createTextBlock(
    @Body() body: TextBlockInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonItemsService.createTextBlock(body, userId);
    return new BaseResponse({ message: "Text block created successfully" });
  }

  @Post("create-question")
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
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async createQuestion(
    @Body()
    body: QuestionInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonItemsService.createQuestion(body, userId);
    return new BaseResponse({ message: "Question created successfully" });
  }

  @Post("create-file")
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
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async createFile(
    @Body() body: FileInsertType,
    @CurrentUser("userId") userId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.lessonItemsService.createFile(body, userId);
    return new BaseResponse({ message: "File created successfully" });
  }
}
