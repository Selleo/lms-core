import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq, ilike, isNotNull } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { files, questions, textBlocks } from "src/storage/schema";

import { LESSON_TYPE } from "./lesson.type";
import { AdminLessonItemsRepository } from "./repositories/adminLessonItems.repository";
import { AdminLessonsRepository } from "./repositories/adminLessons.repository";

import type { LessonItemType } from "./lessonItems.type";
import type { LessonItemTypes } from "./schemas/lesson.types";
import type {
  BetaFileLessonType,
  FileInsertType,
  FileSelectType,
  LessonItemToAdd,
  LessonItemToRemove,
  QuestionInsertType,
  QuestionSelectType,
  SingleLessonItemResponse,
  TextBlockInsertType,
  TextBlockSelectType,
  TextBlockWithLessonId,
  UpdateFileBody,
  UpdateQuestionBody,
  UpdateTextBlockBody,
} from "./schemas/lessonItem.schema";
import type { UUIDType } from "src/common";

type GetLessonItemsQuery = {
  type?: LessonItemType;
  title?: string;
  state?: string;
  archived?: boolean;
  sort?: string;
  page?: number;
  perPage?: number;
};

@Injectable()
export class AdminLessonItemsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly adminLessonItemsRepository: AdminLessonItemsRepository,
    private readonly adminLessonsRepository: AdminLessonsRepository,
  ) {}

  async getAllLessonItems(query: GetLessonItemsQuery = {}) {
    const {
      type,
      title,
      state,
      archived,
      sort = "title",
      page = 1,
      perPage = DEFAULT_PAGE_SIZE,
    } = query;

    let questionItems: QuestionSelectType[] = [];
    let textItems: TextBlockSelectType[] = [];
    let fileItems: FileSelectType[] = [];

    const questionConditions = [
      ...(title ? [ilike(questions.questionBody, `%${title.toLowerCase()}%`)] : []),
      ...(state ? [eq(questions.state, state)] : []),
      ...(archived !== undefined ? [eq(questions.archived, archived)] : []),
    ];

    const textBlockConditions = [
      ...(title ? [ilike(textBlocks.title, `%${title.toLowerCase()}%`)] : []),
      ...(state ? [eq(textBlocks.state, state)] : []),
      ...(archived !== undefined ? [eq(textBlocks.archived, archived)] : []),
    ];

    const fileConditions = [
      ...(title ? [ilike(files.title, `%${title.toLowerCase()}%`)] : []),
      ...(state ? [eq(files.state, state)] : []),
      ...(archived !== undefined ? [eq(files.archived, archived)] : []),
    ];

    if (!type || type === "question") {
      questionItems = await this.adminLessonItemsRepository.getQuestions(questionConditions);
    }
    if (!type || type === "text_block") {
      textItems = await this.adminLessonItemsRepository.getTextBlocks(textBlockConditions);
    }
    if (!type || type === "file") {
      fileItems = await this.adminLessonItemsRepository.getFiles(fileConditions);
    }

    const allItems = [
      ...questionItems.map((item) => ({
        ...item,
        itemType: "question" as const,
      })),
      ...textItems.map((item) => ({
        ...item,
        itemType: "text_block" as const,
      })),
      ...fileItems.map((item) => ({
        ...item,
        itemType: "file" as const,
      })),
    ];

    const sortedItems = sort
      ? allItems.sort((a, b) => {
          const aValue = this.getSortValue(a, sort.startsWith("-") ? sort.slice(1) : sort);
          const bValue = this.getSortValue(b, sort.startsWith("-") ? sort.slice(1) : sort);

          const comparison = aValue > bValue ? 1 : -1;
          return sort.startsWith("-") ? -comparison : comparison;
        })
      : allItems;

    const start = (page - 1) * perPage;
    const paginatedItems = sortedItems.slice(start, start + perPage);

    return {
      data: paginatedItems,
      pagination: {
        page,
        perPage,
        totalItems: sortedItems.length,
      },
    };
  }

  async getAvailableLessonItems() {
    const questionItems = await this.adminLessonItemsRepository.getQuestions([
      eq(questions.state, "published"),
      eq(questions.archived, false),
      isNotNull(questions.id),
    ]);
    const textItems = await this.adminLessonItemsRepository.getTextBlocks([
      eq(textBlocks.state, "published"),
      eq(textBlocks.archived, false),
      isNotNull(textBlocks.id),
      isNotNull(textBlocks.title),
      isNotNull(textBlocks.body),
    ]);

    const fileItems = await this.adminLessonItemsRepository.getFiles([
      eq(files.state, "published"),
      eq(files.archived, false),
      isNotNull(files.id),
      isNotNull(files.title),
    ]);

    const allItems = [
      ...questionItems.map((item) => ({
        ...item,
        itemType: "question" as const,
      })),
      ...textItems.map((item) => ({
        ...item,
        itemType: "text_block" as const,
      })),
      ...fileItems.map((item) => ({ ...item, itemType: "file" as const })),
    ];

    return allItems;
  }

  async getLessonItemById(id: UUIDType) {
    const [textBlock, question, file] = await Promise.all([
      this.adminLessonItemsRepository.getTextBlocks([eq(textBlocks.id, id)]),
      this.adminLessonItemsRepository.getQuestions([eq(questions.id, id)]),
      this.adminLessonItemsRepository.getFiles([eq(files.id, id)]),
    ]);

    if (textBlock.length > 0) {
      return { ...textBlock[0], itemType: "text_block" as const };
    }

    if (question.length > 0) {
      return { ...question[0], itemType: "question" as const };
    }

    if (file.length > 0) {
      return { ...file[0], itemType: "file" as const };
    }

    throw new NotFoundException("Lesson item not found");
  }

  async assignItemsToLesson(lessonId: string, items: LessonItemToAdd[]): Promise<void> {
    const lesson = await this.adminLessonsRepository.getLessonById(lessonId);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    if (lesson.type == LESSON_TYPE.quiz.key) {
      const lessonStudentAnswers = await this.adminLessonItemsRepository.getLessonStudentAnswers(
        lesson.id,
      );

      if (lessonStudentAnswers.length > 0) {
        throw new ConflictException("Lesson already answered, you can't add more items");
      }
    }

    await this.verifyItems(items);

    await this.db.transaction(async (trx) => {
      await this.adminLessonItemsRepository.addLessonItemToLesson(lessonId, items, trx);
      await this.adminLessonsRepository.updateLessonItemsCount(lessonId, trx);
    });
  }

  async unassignItemsFromLesson(lessonId: string, items: LessonItemToRemove[]): Promise<void> {
    const lesson = await this.adminLessonsRepository.getLessonById(lessonId);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    if (lesson.type == LESSON_TYPE.quiz.key) {
      const lessonStudentAnswers = await this.adminLessonItemsRepository.getLessonStudentAnswers(
        lesson.id,
      );

      if (lessonStudentAnswers.length > 0) {
        throw new ConflictException("Lesson already answered, you can't add more items");
      }
    }

    await this.db.transaction(async (trx) => {
      await this.adminLessonItemsRepository.removeLessonItemFromLesson(lessonId, items, trx);
      await this.adminLessonsRepository.updateLessonItemsCount(lessonId, trx);
    });
  }

  async updateTextBlockItem(id: UUIDType, body: UpdateTextBlockBody) {
    const [existingTextBlock] = await this.adminLessonItemsRepository.getTextBlocks([
      eq(textBlocks.id, id),
    ]);

    if (!existingTextBlock) {
      throw new NotFoundException("Text block not found");
    }

    return await this.adminLessonItemsRepository.updateTextBlockItem(id, body);
  }

  async updateQuestionItem(id: UUIDType, body: UpdateQuestionBody) {
    const [question] = await this.adminLessonItemsRepository.getQuestions([eq(questions.id, id)]);

    if (!question) throw new NotFoundException("Question not found");

    // TODO: this check may need to be changed
    const questionStudentAnswers = await this.adminLessonItemsRepository.getQuestionStudentAnswers(
      question.id,
    );

    if (questionStudentAnswers.length > 0) {
      throw new ConflictException("Question already answered");
    }

    return await this.adminLessonItemsRepository.updateQuestionItem(id, body);
  }

  async updateFileItem(id: UUIDType, body: UpdateFileBody) {
    const [file] = await this.adminLessonItemsRepository.getFiles([eq(files.id, id)]);

    if (!file) throw new NotFoundException("File not found");

    return await this.adminLessonItemsRepository.updateFileItem(id, body);
  }

  async createTextBlock(content: TextBlockInsertType, userId: UUIDType) {
    const textBlock = await this.adminLessonItemsRepository.createTextBlock(content, userId);

    if (!textBlock) throw new NotFoundException("Text block not found");

    return textBlock;
  }

  async createQuestion(content: QuestionInsertType, userId: UUIDType) {
    const question = await this.adminLessonItemsRepository.createQuestion(content, userId);

    if (!question) throw new NotFoundException("Question not found");

    return question;
  }

  async createTextBlockAndAssignToLesson(content: TextBlockWithLessonId, userId: UUIDType) {
    return await this.db.transaction(async (trx) => {
      const textBlock = await this.adminLessonItemsRepository.createBetaTextBlock(content, userId);
      const highestDisplayOrder = await this.adminLessonItemsRepository.getHighestDisplayOrder(
        content.lessonId,
        trx,
      );

      const newDisplayOrder = highestDisplayOrder + 1;

      const items: LessonItemToAdd[] = [
        {
          id: textBlock.id,
          type: "text_block",
          displayOrder: newDisplayOrder,
        },
      ];

      await this.assignItemsToLesson(content.lessonId, items);

      if (!textBlock) throw new NotFoundException("Text block not found");

      return textBlock;
    });
  }

  async createFileAndAssignToLesson(content: BetaFileLessonType, userId: UUIDType) {
    return await this.db.transaction(async (trx) => {
      const file = await this.adminLessonItemsRepository.createFile(content, userId);

      if (!file) throw new NotFoundException("File not found");

      const highestDisplayOrder = await this.adminLessonItemsRepository.getHighestDisplayOrder(
        content.lessonId,
        trx,
      );

      const newDisplayOrder = highestDisplayOrder + 1;

      const items: LessonItemToAdd[] = [
        {
          id: file.id,
          type: "file",
          displayOrder: newDisplayOrder,
        },
      ];

      await this.assignItemsToLesson(content.lessonId, items);

      return file;
    });
  }

  async getQuestionAnswers(questionId: UUIDType) {
    return await this.adminLessonItemsRepository.getQuestionAnswers(questionId);
  }

  async removeLesson(chapterId: string, lessonId: string) {
    const lessonItem = await this.adminLessonItemsRepository.getLessonItem(lessonId);

    const result = await this.adminLessonItemsRepository.removeLesson(
      lessonId,
      lessonItem.lessonItemType as LessonItemTypes,
    );

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.adminLessonItemsRepository.updateLessonItemDisplayOrder(chapterId, lessonId);
  }

  async updateFreemiumStatus(lessonId: string, isFreemium: boolean) {
    await this.adminLessonsRepository.updateFreemiumStatus(lessonId, isFreemium);
  }

  async upsertQuestionOptions(
    questionId: UUIDType,
    options: Array<
      Partial<{
        id: string;
        optionText: string;
        isCorrect: boolean;
        position: number;
      }>
    >,
  ) {
    await this.db.transaction(async (trx) => {
      const questionStudentAnswers =
        await this.adminLessonItemsRepository.getQuestionStudentAnswers(questionId, trx);

      if (questionStudentAnswers.length > 0) {
        throw new ConflictException("Question already answered");
      }

      const existingOptions = await this.adminLessonItemsRepository.getQuestionAnswers(
        questionId,
        trx,
      );

      const existingIds = new Set(existingOptions.map((opt) => opt.id));

      const optionsWithIds = options.filter((opt) => opt.id);
      const idsToKeep = new Set(optionsWithIds.map((opt) => opt.id));
      const idsToDelete = [...existingIds].filter((id) => !idsToKeep.has(id));

      if (idsToDelete.length > 0) {
        await this.adminLessonItemsRepository.removeQuestionAnswerOptions(
          questionId,
          idsToDelete,
          trx,
        );
      }

      for (const option of options) {
        if (
          option.optionText === undefined ||
          option.isCorrect === undefined ||
          option.position === undefined
        ) {
          continue;
        }

        await this.adminLessonItemsRepository.upsertQuestionAnswerOptions(
          questionId,
          {
            id: option.id,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            position: option.position,
          },
          trx,
        );
      }
    });
  }

  async createFile(content: FileInsertType, userId: UUIDType) {
    const file = await this.adminLessonItemsRepository.createFile(content, userId);

    if (!file) throw new NotFoundException("File not found");

    return file;
  }

  private async verifyItems(
    items: Array<{ id: string; type: LessonItemType; displayOrder: number }>,
  ): Promise<void> {
    for (const item of items) {
      let result: any[] = [];
      switch (item.type) {
        case "text_block":
          result = await this.adminLessonItemsRepository.getTextBlocks([
            eq(textBlocks.id, item.id),
          ]);
          break;
        case "file":
        case "video":
          result = await this.adminLessonItemsRepository.getFiles([eq(files.id, item.id)]);
          break;
        case "question":
          result = await this.adminLessonItemsRepository.getQuestions([eq(questions.id, item.id)]);
          break;
      }

      if (result.length === 0) {
        throw new BadRequestException(`Element ${item.id} type of ${item.type} not found`);
      }
    }
  }

  private getSortValue(item: SingleLessonItemResponse, field: string) {
    if (field === "title") {
      if (item.itemType === "question") {
        return item.questionBody;
      }
      return item.title;
    }

    if (field === "createdAt") return item.createdAt;
    if (field === "state") return item.state;
    if (field === "archived") return item.archived;

    return "";
  }
}
