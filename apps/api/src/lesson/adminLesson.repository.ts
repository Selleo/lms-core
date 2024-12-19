import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import {
  lessons,
  questionAnswerOptions,
  questions,
  studentQuestionAnswers,
} from "src/storage/schema";

import type {
  CreateLessonBody,
  CreateQuizLessonBody,
  UpdateLessonBody,
  UpdateQuizLessonBody,
} from "./lesson.schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class AdminLessonRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLesson(id: UUIDType) {
    return await this.db.select().from(lessons).where(eq(lessons.id, id));
  }

  async createLessonForChapter(data: CreateLessonBody, authorId: UUIDType) {
    const [lesson] = await this.db.insert(lessons).values(data).returning();
    return lesson;
  }

  async updateLesson(id: string, data: UpdateLessonBody) {
    const [updatedLesson] = await this.db
      .update(lessons)
      .set(data)
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  async updateQuizLessonWithQuestionsAndOptions(id: UUIDType, data: UpdateQuizLessonBody) {
    return this.db
      .update(lessons)
      .set({
        title: data.title,
        type: "quiz",
        description: data.description,
        chapterId: data.chapterId,
      })
      .where(eq(lessons.id, id));
  }

  async createQuizLessonWithQuestionsAndOptions(data: CreateQuizLessonBody, displayOrder: number) {
    const [lesson] = await this.db
      .insert(lessons)
      .values({
        title: data.title,
        type: "quiz",
        description: data.description,
        chapterId: data?.chapterId,
        displayOrder,
      })
      .returning();

    return lesson;
  }

  async getQuestionById(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;
    return await dbInstance
      .select({
        id: questions.id,
        displayOrder: questions.displayOrder,
      })
      .from(questions)
      .where(eq(questions.id, questionId));
  }

  async getQuestions(conditions: any[]) {
    return this.db
      .select()
      .from(questions)
      .where(and(...conditions));
  }

  async getQuestionAnswers(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .select({
        id: questionAnswerOptions.id,
        optionText: questionAnswerOptions.optionText,
        isCorrect: questionAnswerOptions.isCorrect,
        displayOrder: questionAnswerOptions.displayOrder,
        questionId: questionAnswerOptions.questionId,
      })
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
  }

  async getMaxDisplayOrder(chapterId: UUIDType) {
    const [result] = await this.db
      .select({
        maxOrder: sql<number>`COALESCE(max(${lessons.displayOrder}), 0)`,
      })
      .from(lessons)
      .where(eq(lessons.chapterId, chapterId));

    return result.maxOrder;
  }

  // async getHighestDisplayOrder(
  //   lessonId: string,
  //   trx?: PostgresJsDatabase<typeof schema>,
  // ): Promise<number> {
  //   const dbInstance = trx ?? this.db;

  //   const [result] = await dbInstance
  //     .select({
  //       highestOrder: max(lessonItems.displayOrder),
  //     })
  //     .from(lessonItems)
  //     .where(eq(lessonItems.lessonId, lessonId));

  //   return result?.highestOrder ? result.highestOrder : 0;
  // }

  async getQuestionAnswerOptions(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .select()
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
  }

  // async getLessonItem(lessonItemId: string) {
  //   const [lessonItem] = await this.db
  //     .select()
  //     .from(lessonItems)
  //     .where(eq(lessonItems.lessonItemId, lessonItemId));

  //   if (!lessonItem) {
  //     throw new Error(`Lesson item with ID ${lessonItemId} not found`);
  //   }

  //   return lessonItem;
  // }

  async getQuestionStudentAnswers(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .select()
      .from(studentQuestionAnswers)
      .where(eq(studentQuestionAnswers.questionId, questionId));
  }

  async removeLesson(lessonId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(lessons).where(eq(lessons.id, lessonId)).returning();
  }

  async updateLessonDisplayOrder(chapterId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance.execute(sql`
        WITH ranked_chapters AS (
          SELECT id, row_number() OVER (ORDER BY display_order) AS new_display_order
          FROM ${lessons}
          WHERE chapter_id = ${chapterId}
        )
        UPDATE ${lessons} cc
        SET display_order = rc.new_display_order
        FROM ranked_chapters rc
        WHERE cc.id = rc.id
          AND cc.chapter_id = ${chapterId}
      `);
  }

  // async getLessonStudentAnswers(lessonId: UUIDType) {
  //   return await this.db
  //     .select()
  //     .from(studentQuestionAnswers)
  //     .where(eq(studentQuestionAnswers.lessonId, lessonId));
  // }

  // async getTextBlocks(conditions: any[]) {
  //   return await this.db
  //     .select()
  //     .from(textBlocks)
  //     .where(and(...conditions));
  // }

  // async getFiles(conditions: any[]) {
  //   return await this.db
  //     .select()
  //     .from(files)
  //     .where(and(...conditions));
  // }

  // async createTextBlock(content: any, userId: UUIDType) {
  //   const [textBlock] = await this.db
  //     .insert(textBlocks)
  //     .values({
  //       title: content.title,
  //       body: content.body,
  //       state: content.state,
  //       authorId: userId,
  //     })
  //     .returning();

  //   return textBlock;
  // }

  // async createBetaTextBlock(content: any, userId: UUIDType) {
  //   const [textBlock] = await this.db
  //     .insert(textBlocks)
  //     .values({
  //       title: content.title,
  //       body: content.body,
  //       state: content.state,
  //       authorId: userId,
  //     })
  //     .returning();

  //   return textBlock;
  // }

  // async createQuestion(content: any, userId: UUIDType) {
  //   const [question] = await this.db
  //     .insert(questions)
  //     .values({
  //       questionType: content.questionType,
  //       questionBody: content.questionBody,
  //       solutionExplanation: content.solutionExplanation,
  //       state: content.state,
  //       authorId: userId,
  //     })
  //     .returning();

  //   return question;
  // }

  // async createFile(content: any, userId: UUIDType) {
  //   const [file] = await this.db
  //     .insert(files)
  //     .values({
  //       title: content.title,
  //       type: content.type,
  //       url: content.url,
  //       body: content.body,
  //       state: content.state,
  //       authorId: userId,
  //     })
  //     .returning();

  //   return file;
  // }

  // async updateTextBlockItem(id: UUIDType, body: UpdateTextBlockBody) {
  //   const [updatedTextBlock] = await this.db
  //     .update(textBlocks)
  //     .set({
  //       title: body.title,
  //       body: body.body,
  //       state: body.state,
  //       archived: body.archived,
  //     })
  //     .where(eq(textBlocks.id, id))
  //     .returning();

  //   return updatedTextBlock;
  // }

  // async updateQuestionItem(id: UUIDType, body: UpdateQuestionBody) {
  //   const [question] = await this.db
  //     .update(questions)
  //     .set({
  //       questionType: body.questionType,
  //       questionBody: body.questionBody,
  //       solutionExplanation: body.solutionExplanation,
  //       state: body.state,
  //     })
  //     .where(eq(questions.id, id))
  //     .returning();

  //   return question;
  // }

  // async updateFileItem(id: UUIDType, body: UpdateFileBody) {
  //   const [file] = await this.db
  //     .update(files)
  //     .set({
  //       title: body.title,
  //       type: body.type,
  //       url: body.url,
  //       state: body.state,
  //     })
  //     .where(eq(files.id, id))
  //     .returning();

  //   return file;
  // }

  // async removeLessonItemFromLesson(
  //   lessonId: UUIDType,
  //   items: LessonItemToRemove[],
  //   trx?: PostgresJsDatabase<typeof schema>,
  // ) {
  //   const dbInstance = trx ?? this.db;

  //   return await dbInstance.delete(lessonItems).where(
  //     and(
  //       eq(lessonItems.lessonId, lessonId),
  //       inArray(
  //         lessonItems.lessonItemId,
  //         items.map((item) => item.id),
  //       ),
  //     ),
  //   );
  // }

  async updateLessonItemDisplayOrder(chapterId: UUIDType, lessonId: UUIDType) {
    await this.db.transaction(async (trx) => {
      await trx.execute(sql`
        UPDATE ${lessons}
        SET display_order = display_order - 1
        WHERE chapter_id = ${chapterId}
          AND display_order > (
            SELECT display_order
            FROM ${lessons}
            WHERE chapter_id = ${chapterId}
              AND id = ${lessonId}
          )
      `);

      await trx.execute(sql`
        WITH ranked_lesson AS (
          SELECT id, row_number() OVER (ORDER BY display_order) AS new_display_order
          FROM ${lessons}
          WHERE chapter_id = ${chapterId}
        )
        UPDATE ${lessons} li
        SET display_order = rl.new_display_order
        FROM ranked_lesson rl
        WHERE li.id = rl.id
          AND li.chapter_id = ${chapterId}
      `);
    });
  }

  // async removeLesson(lessonItemId: string, lessonItemType: LessonItemTypes) {
  //   return await this.db.transaction(async (trx) => {
  //     switch (lessonItemType) {
  //       case "text_block":
  //         await trx.delete(textBlocks).where(eq(textBlocks.id, lessonItemId));
  //         break;

  //       case "question":
  //         await trx.delete(questions).where(eq(questions.id, lessonItemId));
  //         break;

  //       case "file":
  //         await trx.delete(files).where(eq(files.id, lessonItemId));
  //         break;

  //       default:
  //         throw new Error(`Unsupported lesson item type: ${lessonItemType}`);
  //     }

  //     return await trx
  //       .delete(lessonItems)
  //       .where(eq(lessonItems.lessonItemId, lessonItemId))
  //       .returning();
  //   });
  // }

  async removeQuestionAnswerOptions(
    questionId: UUIDType,
    idsToDelete: UUIDType[],
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .delete(questionAnswerOptions)
      .where(
        and(
          eq(questionAnswerOptions.questionId, questionId),
          inArray(questionAnswerOptions.id, idsToDelete),
        ),
      );
  }

  async upsertQuestionAnswerOptions(
    questionId: UUIDType,
    option: {
      id?: string;
      optionText: string;
      isCorrect: boolean;
      displayOrder: number;
    },
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;
    return dbInstance
      .insert(questionAnswerOptions)
      .values({
        id: option.id,
        questionId,
        optionText: option.optionText,
        isCorrect: option.isCorrect,
        displayOrder: option.displayOrder,
      })
      .onConflictDoUpdate({
        target: questionAnswerOptions.id,
        set: {
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          displayOrder: option.displayOrder,
        },
      });
  }
}
