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
            matchedWord: option.matchedWord,
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

      const existingQuestions = await this.adminLessonRepository.getExistingQuestions(id);
      const existingQuestionIds = existingQuestions.map((question) => question.id);
      const inputQuestionIds = data.questions
        ? data.questions.map((question) => question.id).filter(Boolean)
        : [];

      const questionsToDelete = existingQuestionIds.filter(
        (existingId) => !inputQuestionIds.includes(existingId),
      );

      if (questionsToDelete.length > 0) {
        await this.adminLessonRepository.deleteQuestionsAndOptions(questionsToDelete);
      }

      if (data.questions) {
        for (const question of data.questions) {
          const questionId = await this.adminLessonRepository.upsertQuestion(
            question,
            id,
            authorId,
          );

          if (question.options) {
            await this.adminLessonRepository.upsertOptions(questionId, question.options);
          }
        }
      }

      return id;
    });
  }
}
