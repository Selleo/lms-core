import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, gte, inArray, lte, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { lessons, questionAnswerOptions, questions } from "src/storage/schema";

import { LESSON_TYPES } from "../lesson.type";
import { AdminLessonRepository } from "../repositories/adminLesson.repository";
import { LessonRepository } from "../repositories/lesson.repository";

import type {
  CreateLessonBody,
  CreateQuizLessonBody,
  UpdateLessonBody,
  UpdateQuizLessonBody,
} from "../lesson.schema";
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
      (data.type === LESSON_TYPES.PRESENTATION || data.type === LESSON_TYPES.VIDEO) &&
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
      (data.type === LESSON_TYPES.PRESENTATION || data.type === LESSON_TYPES.VIDEO) &&
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

    // TODO: extract to repository
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
        displayOrder: question.displayOrder,
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

      // TODO: extract to repository
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
        // TODO: extract to repository
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
            displayOrder: question.displayOrder,
            photoS3Key: question.photoS3Key,
            photoQuestionType: question.photoQuestionType || null,
          };

          // TODO: extract to repository
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
            // TODO: extract to repository
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

              // TODO: extract to repository
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
}