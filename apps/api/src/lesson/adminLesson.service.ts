import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, gte, inArray, lte, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { lessons, questionAnswerOptions, questions } from "src/storage/schema";

import { AdminLessonRepository } from "./adminLesson.repository";
import { LessonRepository } from "./lesson.repository";
import { LESSON_TYPES } from "./lesson.type";

import type {
  CreateLessonBody,
  CreateQuizLessonBody,
  UpdateLessonBody,
  UpdateQuizLessonBody,
} from "./lesson.schem";
import type { UUIDType } from "src/common";

@Injectable()
export class AdminLessonService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private adminLessonRepository: AdminLessonRepository,
    private lessonRepository: LessonRepository,
  ) {}

  async createLessonForChapter(data: CreateLessonBody, authorId: UUIDType) {
    if (
      (data.type === LESSON_TYPES.presentation || data.type === LESSON_TYPES.video) &&
      (!data.fileS3Key || !data.fileType)
    ) {
      throw new BadRequestException("File is required for video and presentation lessons");
    }

    const maxDisplayOrder = await this.adminLessonRepository.getMaxDisplayOrder(data.chapterId);

    const lesson = await this.adminLessonRepository.createLessonForChapter(
      { ...data, displayOrder: maxDisplayOrder + 1 },
      authorId,
    );
    return lesson.id;
  }

  async createQuizLesson(data: CreateQuizLessonBody, authorId: UUIDType) {
    const maxDisplayOrder = await this.adminLessonRepository.getMaxDisplayOrder(data.chapterId);

    const lesson = await this.createQuizLessonWithQuestionsAndOptions(
      data,
      authorId,
      maxDisplayOrder + 1,
    );
    return lesson?.id;
  }

  async updateQuizLesson(id: UUIDType, data: UpdateQuizLessonBody, authorId: UUIDType) {
    const lesson = await this.lessonRepository.getLesson(id);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const updatedLessonId = await this.updateQuizLessonWithQuestionsAndOptions(id, data, authorId);
    return updatedLessonId;
  }

  async updateLesson(id: string, data: UpdateLessonBody) {
    const lesson = await this.lessonRepository.getLesson(id);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    if (
      (data.type === LESSON_TYPES.presentation || data.type === LESSON_TYPES.video) &&
      (!data.fileS3Key || !data.fileType)
    ) {
      throw new BadRequestException("File is required for video and presentation lessons");
    }

    const updatedLesson = await this.adminLessonRepository.updateLesson(id, data);
    return updatedLesson.id;
  }

  async removeLesson(lessonId: UUIDType) {
    const [lesson] = await this.adminLessonRepository.getLesson(lessonId);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    await this.db.transaction(async (trx) => {
      await this.adminLessonRepository.removeLesson(lessonId, trx);
      await this.adminLessonRepository.updateLessonDisplayOrder(lesson.chapterId, trx);
    });
  }

  async updateLessonDisplayOrder(lessonObject: {
    lessonId: UUIDType;
    displayOrder: number;
  }): Promise<void> {
    const [lessonToUpdate] = await this.adminLessonRepository.getLesson(lessonObject.lessonId);

    const oldDisplayOrder = lessonToUpdate.displayOrder;
    if (!lessonToUpdate || oldDisplayOrder === null) {
      throw new NotFoundException("Lesson not found");
    }

    const newDisplayOrder = lessonObject.displayOrder;

    await this.db.transaction(async (trx) => {
      await trx
        .update(lessons)
        .set({
          displayOrder: sql`CASE
            WHEN ${eq(lessons.id, lessonToUpdate.id)}
              THEN ${newDisplayOrder}
            WHEN ${newDisplayOrder < oldDisplayOrder}
              AND ${gte(lessons.displayOrder, newDisplayOrder)}
              AND ${lte(lessons.displayOrder, oldDisplayOrder)}
              THEN ${lessons.displayOrder} + 1
            WHEN ${newDisplayOrder > oldDisplayOrder}
              AND ${lte(lessons.displayOrder, newDisplayOrder)}
              AND ${gte(lessons.displayOrder, oldDisplayOrder)}
              THEN ${lessons.displayOrder} - 1
            ELSE ${lessons.displayOrder}
          END
          `,
        })
        .where(eq(lessons.chapterId, lessonToUpdate.chapterId));
    });
  }

  async createQuizLessonWithQuestionsAndOptions(
    data: CreateQuizLessonBody,
    authorId: UUIDType,
    displayOrder: number,
  ) {
    return await this.db.transaction(async (trx) => {
      const lesson = await this.adminLessonRepository.createQuizLessonWithQuestionsAndOptions(
        data,
        displayOrder,
      );

      if (!data.questions) return;

      const questionsToInsert = data?.questions?.map((question) => ({
        lessonId: lesson.id,
        authorId,
        type: question.type,
        description: question.description || null,
        title: question.title,
        photoS3Key: question.photoS3Key,
        photoQuestionType: question.photoQuestionType || null,
      }));

      const insertedQuestions = await trx.insert(questions).values(questionsToInsert).returning();

      const optionsToInsert = insertedQuestions.flatMap(
        (question, index) =>
          data.questions?.[index].options?.map((option) => ({
            questionId: question.id,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            displayOrder: option.displayOrder,
          })) || [],
      );

      if (optionsToInsert.length > 0) {
        await trx.insert(questionAnswerOptions).values(optionsToInsert);
      }

      return lesson;
    });
  }

  async updateQuizLessonWithQuestionsAndOptions(
    id: UUIDType,
    data: UpdateQuizLessonBody,
    authorId: UUIDType,
  ) {
    return await this.db.transaction(async (trx) => {
      await this.adminLessonRepository.updateQuizLessonWithQuestionsAndOptions(id, data);

      const existingQuestions = await trx
        .select({ id: questions.id })
        .from(questions)
        .where(eq(questions.lessonId, id));

      const existingQuestionIds = existingQuestions.map((question) => question.id);

      const inputQuestionIds = data.questions
        ? data.questions.map((question) => question.id).filter(Boolean)
        : [];

      const questionsToDelete = existingQuestionIds.filter(
        (existingId) => !inputQuestionIds.includes(existingId),
      );

      if (questionsToDelete.length > 0) {
        await trx.delete(questions).where(inArray(questions.id, questionsToDelete));
        await trx
          .delete(questionAnswerOptions)
          .where(inArray(questionAnswerOptions.questionId, questionsToDelete));
      }

      if (data.questions) {
        for (const question of data.questions) {
          const questionData = {
            type: question.type,
            description: question.description || null,
            title: question.title,
            photoS3Key: question.photoS3Key,
            photoQuestionType: question.photoQuestionType || null,
          };

          const questionId =
            question.id ??
            ((
              await trx
                .insert(questions)
                .values({
                  lessonId: id,
                  authorId,
                  ...questionData,
                })
                .returning()
            )[0].id as UUIDType);

          if (question.id) {
            await trx.update(questions).set(questionData).where(eq(questions.id, questionId));
          }

          if (question.options) {
            const existingOptions = await trx
              .select({ id: questionAnswerOptions.id })
              .from(questionAnswerOptions)
              .where(eq(questionAnswerOptions.questionId, questionId));

            const existingOptionIds = existingOptions.map((option) => option.id);
            const inputOptionIds = question.options.map((option) => option.id).filter(Boolean);

            const optionsToDelete = existingOptionIds.filter(
              (existingId) => !inputOptionIds.includes(existingId),
            );

            if (optionsToDelete.length > 0) {
              await trx
                .delete(questionAnswerOptions)
                .where(inArray(questionAnswerOptions.id, optionsToDelete));
            }

            for (const option of question.options) {
              const optionData = {
                optionText: option.optionText,
                isCorrect: option.isCorrect,
                displayOrder: option.displayOrder,
              };

              if (option.id) {
                await trx
                  .update(questionAnswerOptions)
                  .set(optionData)
                  .where(eq(questionAnswerOptions.id, option.id));
              } else {
                await trx.insert(questionAnswerOptions).values({
                  questionId,
                  ...optionData,
                });
              }
            }
          }
        }
      }

      return id;
    });
  }

  // async getAllLessonItems(query: GetLessonItemsQuery = {}) {
  //   const {
  //     type,
  //     title,
  //     state,
  //     archived,
  //     sort = "title",
  //     page = 1,
  //     perPage = DEFAULT_PAGE_SIZE,
  //   } = query;

  //   let questionItems: QuestionSelectType[] = [];
  //   let textItems: TextBlockSelectType[] = [];
  //   let fileItems: FileSelectType[] = [];

  //   const questionConditions = [
  //     ...(title ? [ilike(questions.questionBody, `%${title.toLowerCase()}%`)] : []),
  //     ...(state ? [eq(questions.state, state)] : []),
  //     ...(archived !== undefined ? [eq(questions.archived, archived)] : []),
  //   ];

  //   const textBlockConditions = [
  //     ...(title ? [ilike(textBlocks.title, `%${title.toLowerCase()}%`)] : []),
  //     ...(state ? [eq(textBlocks.state, state)] : []),
  //     ...(archived !== undefined ? [eq(textBlocks.archived, archived)] : []),
  //   ];

  //   const fileConditions = [
  //     ...(title ? [ilike(files.title, `%${title.toLowerCase()}%`)] : []),
  //     ...(state ? [eq(files.state, state)] : []),
  //     ...(archived !== undefined ? [eq(files.archived, archived)] : []),
  //   ];

  //   if (!type || type === "question") {
  //     questionItems = await this.adminLessonItemsRepository.getQuestions(questionConditions);
  //   }
  //   if (!type || type === "text_block") {
  //     textItems = await this.adminLessonItemsRepository.getTextBlocks(textBlockConditions);
  //   }
  //   if (!type || type === "file") {
  //     fileItems = await this.adminLessonItemsRepository.getFiles(fileConditions);
  //   }

  //   const allItems = [
  //     ...questionItems.map((item) => ({
  //       ...item,
  //       itemType: "question" as const,
  //     })),
  //     ...textItems.map((item) => ({
  //       ...item,
  //       itemType: "text_block" as const,
  //     })),
  //     ...fileItems.map((item) => ({
  //       ...item,
  //       itemType: "file" as const,
  //     })),
  //   ];

  //   const sortedItems = sort
  //     ? allItems.sort((a, b) => {
  //         const aValue = this.getSortValue(a, sort.startsWith("-") ? sort.slice(1) : sort);
  //         const bValue = this.getSortValue(b, sort.startsWith("-") ? sort.slice(1) : sort);

  //         const comparison = aValue > bValue ? 1 : -1;
  //         return sort.startsWith("-") ? -comparison : comparison;
  //       })
  //     : allItems;

  //   const start = (page - 1) * perPage;
  //   const paginatedItems = sortedItems.slice(start, start + perPage);

  //   return {
  //     data: paginatedItems,
  //     pagination: {
  //       page,
  //       perPage,
  //       totalItems: sortedItems.length,
  //     },
  //   };
  // }

  // async getAvailableLessonItems() {
  //   const questionItems = await this.adminLessonItemsRepository.getQuestions([
  //     eq(questions.state, "published"),
  //     eq(questions.archived, false),
  //     isNotNull(questions.id),
  //   ]);
  //   const textItems = await this.adminLessonItemsRepository.getTextBlocks([
  //     eq(textBlocks.state, "published"),
  //     eq(textBlocks.archived, false),
  //     isNotNull(textBlocks.id),
  //     isNotNull(textBlocks.title),
  //     isNotNull(textBlocks.body),
  //   ]);

  //   const fileItems = await this.adminLessonItemsRepository.getFiles([
  //     eq(files.state, "published"),
  //     eq(files.archived, false),
  //     isNotNull(files.id),
  //     isNotNull(files.title),
  //   ]);

  //   const allItems = [
  //     ...questionItems.map((item) => ({
  //       ...item,
  //       itemType: "question" as const,
  //     })),
  //     ...textItems.map((item) => ({
  //       ...item,
  //       itemType: "text_block" as const,
  //     })),
  //     ...fileItems.map((item) => ({ ...item, itemType: "file" as const })),
  //   ];

  //   return allItems;
  // }

  // async getLessonItemById(id: UUIDType) {
  //   const [textBlock, question, file] = await Promise.all([
  //     this.adminLessonItemsRepository.getTextBlocks([eq(textBlocks.id, id)]),
  //     this.adminLessonItemsRepository.getQuestions([eq(questions.id, id)]),
  //     this.adminLessonItemsRepository.getFiles([eq(files.id, id)]),
  //   ]);

  //   if (textBlock.length > 0) {
  //     return { ...textBlock[0], itemType: "text_block" as const };
  //   }

  //   if (question.length > 0) {
  //     return { ...question[0], itemType: "question" as const };
  //   }

  //   if (file.length > 0) {
  //     return { ...file[0], itemType: "file" as const };
  //   }

  //   throw new NotFoundException("Lesson item not found");
  // }

  // async assignItemsToLesson(lessonId: stritems: LessonItemToAdd[]): Promise<void> {
  //   const lesson = await this.adminChapterRepository.getLessonById(lessonId);

  //   if (!lesson) {
  //     throw new NotFoundException("Lesson not found");
  //   }

  //   if (lesson.type == LESSON_TYPE.quiz.key) {
  //     const lessonStudentAnswers = await this.adminLessonItemsRepository.getLessonStudentAnswers(
  //       lesson.id,
  //     );

  //     if (lessonStudentAnswers.length > 0) {
  //       throw new ConflictException("Lesson already answered, you can't add more items");
  //     }
  //   }

  //   await this.verifyItems(items);

  //   await this.db.transaction(async (trx) => {
  //     await this.adminLessonRepository.addLessonItemToLesson(lessonId, items, trx);
  //     await this.adminChapterRepository.updateLessonItemsCount(lessonId, trx);
  //   });
  // }

  // async unassignItemsFromLesson(lessonId:ng, items: LessonItemToRemove[]): Promise<void> {
  //   const lesson = await this.adminChapterRepository.getLessonById(lessonId);

  //   if (!lesson) {
  //     throw new NotFoundException("Lesson not found");
  //   }

  //   if (lesson.type == LESSON_TYPE.quiz.key) {
  //     const lessonStudentAnswers = await this.adminLessonItemsRepository.getLessonStudentAnswers(
  //       lesson.id,
  //     );

  //     if (lessonStudentAnswers.length > 0) {
  //       throw new ConflictException("Lesson already answered, you can't add more items");
  //     }
  //   }

  //   await this.db.transaction(async (trx) => {
  //     await this.adminLessonRepository.removeLessonItemFromLesson(lessonId, items, trx);
  //     await this.adminChapterRepository.updateLessonItemsCount(lessonId, trx);
  //   });
  // }

  // async updateTextBlockItem(id: UUIDType, body: UpdateTextBlockBody) {
  //   const [existingTextBlock] = await this.adminLessonItemsRepository.getTextBlocks([
  //     eq(textBlocks.id, id),
  //   ]);

  //   if (!existingTextBlock) {
  //     throw new NotFoundException("Text block not found");
  //   }

  //   return await this.adminLessonItemsRepository.updateTextBlockItem(id, body);
  // }

  // async updateQuestionItem(id: UUIDType, body: UpdateQuestionBody) {
  //   const [question] = await this.adminLessonItemsRepository.getQuestions([eq(questions.id, id)]);

  //   if (!question) throw new NotFoundException("Question not found");

  //   // TODO: this check may need to be changed
  //   const questionStudentAnswers = await this.adminLessonItemsRepository.getQuestionStudentAnswers(
  //     question.id,
  //   );

  //   if (questionStudentAnswers.length > 0) {
  //     throw new ConflictException("Question already answered");
  //   }

  //   return await this.adminLessonItemsRepository.updateQuestionItem(id, body);
  // }

  // async updateFileItem(id: UUIDType, body: UpdateFileBody) {
  //   const [file] = await this.adminLessonItemsRepository.getFiles([eq(files.id, id)]);

  //   if (!file) throw new NotFoundException("File not found");

  //   return await this.adminLessonItemsRepository.updateFileItem(id, body);
  // }

  // async createTextBlock(content: TextBlockInsertType, userId: UUIDType) {
  //   const textBlock = await this.adminLessonItemsRepository.createTextBlock(content, userId);

  //   if (!textBlock) throw new NotFoundException("Text block not found");

  //   return textBlock;
  // }

  // async createQuestion(content: QuestionInsertType, userId: UUIDType) {
  //   const question = await this.adminLessonItemsRepository.createQuestion(content, userId);

  //   if (!question) throw new NotFoundException("Question not found");

  //   return question;
  // }

  // async createTextBlockAndAssignToLesson(content: TextBlockWithLessonId, userId: UUIDType) {
  //   return await this.db.transaction(async (trx) => {
  //     const textBlock = await this.adminLessonItemsRepository.createBetaTextBlock(content, userId);
  //     const highestDisplayOrder = await this.adminLessonItemsRepository.getHighestDisplayOrder(
  //       content.lessonId,
  //       trx,
  //     );

  //     const newDisplayOrder = highestDisplayOrder + 1;

  //     const items: LessonItemToAdd[] = [
  //       {
  //         id: textBlock.id,
  //         type: "text_block",
  //         displayOrder: newDisplayOrder,
  //       },
  //     ];

  //     await this.assignItemsToLesson(content.lessonId, items);

  //     if (!textBlock) throw new NotFoundException("Text block not found");

  //     return textBlock;
  //   });
  // }

  // async createFileAndAssignToLesson(content: BetaFileLessonType, userId: UUIDType) {
  //   return await this.db.transaction(async (trx) => {
  //     const file = await this.adminLessonItemsRepository.createFile(content, userId);

  //     if (!file) throw new NotFoundException("File not found");

  //     const highestDisplayOrder = await this.adminLessonItemsRepository.getHighestDisplayOrder(
  //       content.lessonId,
  //       trx,
  //     );

  //     const newDisplayOrder = highestDisplayOrder + 1;

  //     const items: LessonItemToAdd[] = [
  //       {
  //         id: file.id,
  //         type: "file",
  //         displayOrder: newDisplayOrder,
  //       },
  //     ];

  //     await this.assignItemsToLesson(content.lessonId, items);

  //     return file;
  //   });
  // }

  // async getQuestionAnswers(questionId: UUIDType) {
  //   return await this.adminLessonItemsRepository.getQuestionAnswers(questionId);
  // }

  // async removeLesson(chapterId: string, lessonId: string) {
  //   const lessonItem = await this.adminLessonItemsRepository.getLessonItem(lessonId);

  //   const result = await this.adminLessonItemsRepository.removeLesson(
  //     lessonId,
  //     lessonItem.lessonItemType as LessonItemTypes,
  //   );

  //   if (result.length === 0) {
  //     throw new NotFoundException("Lesson not found in this course");
  //   }

  //   await this.adminLessonItemsRepository.updateLessonItemDisplayOrder(chapterId, lessonId);
  // }

  // async updateFreemiumStatssonId: string, isFreemium: boolean) {
  //   await this.adminChapterRepository.updateFreemiumStatus(lessonId, isFreemium);
  // }

  // async upsertQuestionOptions(
  //   questionId: UUIDType,
  //   options: Array<
  //     Partial<{
  //       id: string;
  //       optionText: string;
  //       isCorrect: boolean;
  //       position: number;
  //     }>
  //   >,
  // ) {
  //   await this.db.transaction(async (trx) => {
  //     const questionStudentAnswers =
  //       await this.adminLessonItemsRepository.getQuestionStudentAnswers(questionId, trx);

  //     if (questionStudentAnswers.length > 0) {
  //       throw new ConflictException("Question already answered");
  //     }

  //     const existingOptions = await this.adminLessonItemsRepository.getQuestionAnswers(
  //       questionId,
  //       trx,
  //     );

  //     const existingIds = new Set(existingOptions.map((opt) => opt.id));

  //     const optionsWithIds = options.filter((opt) => opt.id);
  //     const idsToKeep = new Set(optionsWithIds.map((opt) => opt.id));
  //     const idsToDelete = [...existingIds].filter((id) => !idsToKeep.has(id));

  //     if (idsToDelete.length > 0) {
  //       await this.adminLessonItemsRepository.removeQuestionAnswerOptions(
  //         questionId,
  //         idsToDelete,
  //         trx,
  //       );
  //     }

  //     for (const option of options) {
  //       if (
  //         option.optionText === undefined ||
  //         option.isCorrect === undefined ||
  //         option.position === undefined
  //       ) {
  //         continue;
  //       }

  //       await this.adminLessonItemsRepository.upsertQuestionAnswerOptions(
  //         questionId,
  //         {
  //           id: option.id,
  //           optionText: option.optionText,
  //           isCorrect: option.isCorrect,
  //           position: option.position,
  //         },
  //         trx,
  //       );
  //     }
  //   });
  // }

  // async createFile(content: FileInsertType, userId: UUIDType) {
  //   const file = await this.adminLessonItemsRepository.createFile(content, userId);

  //   if (!file) throw new NotFoundException("File not found");

  //   return file;
  // }

  // private async verifyItems(
  //   items: Array<{ id: string; type: LessonItemType; displayOrder: number }>,
  // ): Promise<void> {
  //   for (const item of items) {
  //     let result: any[] = [];
  //     switch (item.type) {
  //       case "text_block":
  //         result = await this.adminLessonItemsRepository.getTextBlocks([
  //           eq(textBlocks.id, item.id),
  //         ]);
  //         break;
  //       case "file":
  //       case "video":
  //         result = await this.adminLessonItemsRepository.getFiles([eq(files.id, item.id)]);
  //         break;
  //       case "question":
  //         result = await this.adminLessonItemsRepository.getQuestions([eq(questions.id, item.id)]);
  //         break;
  //     }

  //     if (result.length === 0) {
  //       throw new BadRequestException(`Element ${item.id} type of ${item.type} not found`);
  //     }
  //   }
  // }

  // private getSortValue(item: SingleLessonItemResponse, field: string) {
  //   if (field === "title") {
  //     if (item.itemType === "question") {
  //       return item.questionBody;
  //     }
  //     return item.title;
  //   }

  //   if (field === "createdAt") return item.createdAt;
  //   if (field === "state") return item.state;
  //   if (field === "archived") return item.archived;

  //   return "";
  // }
}
