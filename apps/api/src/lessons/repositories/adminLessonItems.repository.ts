import { Inject, Injectable } from "@nestjs/common";
import { eq, and, inArray, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import {
  lessonItems,
  files,
  questions,
  textBlocks,
  questionAnswerOptions,
  studentQuestionAnswers,
} from "src/storage/schema";

import type { LessonItemTypes } from "../schemas/lesson.types";
import type {
  LessonItemToAdd,
  LessonItemToRemove,
  UpdateFileBody,
  UpdateQuestionBody,
  UpdateTextBlockBody,
} from "../schemas/lessonItem.schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class AdminLessonItemsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getQuestions(conditions: any[]) {
    return await this.db
      .select()
      .from(questions)
      .where(and(...conditions));
  }

  async getQuestionAnswers(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select({
        id: questionAnswerOptions.id,
        optionText: questionAnswerOptions.optionText,
        isCorrect: questionAnswerOptions.isCorrect,
        position: questionAnswerOptions.position,
      })
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
  }

  async getHighestDisplayOrder(
    lessonId: string,
    trx?: PostgresJsDatabase<typeof schema>,
  ): Promise<number> {
    const dbInstance = trx ?? this.db;

    const result = await dbInstance
      .select({
        highestOrder: sql<number>`MAX(${lessonItems.displayOrder})`,
      })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId))
      .limit(1);

    return result.length > 0 && result[0].highestOrder !== null ? result[0].highestOrder : 0;
  }

  async getQuestionAnswerOptions(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select()
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
  }

  async getLessonItem(lessonItemId: string) {
    const lessonItem = await this.db
      .select()
      .from(lessonItems)
      .where(eq(lessonItems.lessonItemId, lessonItemId))
      .limit(1);

    if (!lessonItem || lessonItem.length === 0) {
      throw new Error(`Lesson item with ID ${lessonItemId} not found`);
    }

    return lessonItem[0];
  }

  async getQuestionStudentAnswers(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select()
      .from(studentQuestionAnswers)
      .where(eq(studentQuestionAnswers.questionId, questionId));
  }

  async getLessonStudentAnswers(lessonId: UUIDType) {
    return await this.db
      .select()
      .from(studentQuestionAnswers)
      .where(eq(studentQuestionAnswers.lessonId, lessonId));
  }

  async getTextBlocks(conditions: any[]) {
    return await this.db
      .select()
      .from(textBlocks)
      .where(and(...conditions));
  }

  async getFiles(conditions: any[]) {
    return await this.db
      .select()
      .from(files)
      .where(and(...conditions));
  }

  async createTextBlock(content: any, userId: UUIDType) {
    const [textBlock] = await this.db
      .insert(textBlocks)
      .values({
        title: content.title,
        body: content.body,
        state: content.state,
        authorId: userId,
      })
      .returning();

    return textBlock;
  }

  async createBetaTextBlock(content: any, userId: UUIDType) {
    const [textBlock] = await this.db
      .insert(textBlocks)
      .values({
        title: content.title,
        body: content.body,
        state: content.state,
        authorId: userId,
      })
      .returning();

    return textBlock;
  }

  async createQuestion(content: any, userId: UUIDType) {
    const [question] = await this.db
      .insert(questions)
      .values({
        questionType: content.questionType,
        questionBody: content.questionBody,
        solutionExplanation: content.solutionExplanation,
        state: content.state,
        authorId: userId,
      })
      .returning();

    return question;
  }

  async createFile(content: any, userId: UUIDType) {
    const [file] = await this.db
      .insert(files)
      .values({
        title: content.title,
        type: content.type,
        url: content.url,
        body: content.body,
        state: content.state,
        authorId: userId,
      })
      .returning();

    return file;
  }

  async updateTextBlockItem(id: UUIDType, body: UpdateTextBlockBody) {
    const [updatedTextBlock] = await this.db
      .update(textBlocks)
      .set({
        title: body.title,
        body: body.body,
        state: body.state,
        archived: body.archived,
      })
      .where(eq(textBlocks.id, id))
      .returning();

    return updatedTextBlock;
  }

  async updateQuestionItem(id: UUIDType, body: UpdateQuestionBody) {
    const [question] = await this.db
      .update(questions)
      .set({
        questionType: body.questionType,
        questionBody: body.questionBody,
        solutionExplanation: body.solutionExplanation,
        state: body.state,
      })
      .where(eq(questions.id, id))
      .returning();

    return question;
  }

  async updateFileItem(id: UUIDType, body: UpdateFileBody) {
    const [file] = await this.db
      .update(files)
      .set({
        title: body.title,
        type: body.type,
        url: body.url,
        state: body.state,
      })
      .where(eq(files.id, id))
      .returning();

    return file;
  }

  async addLessonItemToLesson(
    lessonId: UUIDType,
    items: LessonItemToAdd[],
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.insert(lessonItems).values(
      items.map((item) => ({
        lessonId,
        lessonItemId: item.id,
        lessonItemType: item.type,
        displayOrder: item.displayOrder,
      })),
    );
  }

  async removeLessonItemFromLesson(
    lessonId: UUIDType,
    items: LessonItemToRemove[],
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(lessonItems).where(
      and(
        eq(lessonItems.lessonId, lessonId),
        inArray(
          lessonItems.lessonItemId,
          items.map((item) => item.id),
        ),
      ),
    );
  }

  async updateLessonItemDisplayOrder(chapterId: UUIDType, lessonId: UUIDType) {
    await this.db.transaction(async (trx) => {
      await trx.execute(sql`
        UPDATE ${lessonItems}
        SET display_order = display_order - 1
        WHERE lesson_id = ${chapterId}
          AND display_order > (
            SELECT display_order
            FROM ${lessonItems}
            WHERE lesson_id = ${chapterId}
              AND lesson_item_id = ${lessonId}
          )
      `);

      await trx.execute(sql`
        WITH ranked_lesson_items AS (
          SELECT lesson_item_id, row_number() OVER (ORDER BY display_order) AS new_display_order
          FROM ${lessonItems}
          WHERE lesson_id = ${chapterId}
        )
        UPDATE ${lessonItems} li
        SET display_order = rl.new_display_order
        FROM ranked_lesson_items rl
        WHERE li.lesson_item_id = rl.lesson_item_id
          AND li.lesson_id = ${chapterId}
      `);
    });
  }

  async removeLesson(lessonItemId: string, lessonItemType: LessonItemTypes) {
    return await this.db.transaction(async (trx) => {
      switch (lessonItemType) {
        case "text_block":
          await trx.delete(textBlocks).where(eq(textBlocks.id, lessonItemId));
          break;

        case "questions":
          await trx.delete(questions).where(eq(questions.id, lessonItemId));
          break;

        case "file":
          await trx.delete(files).where(eq(files.id, lessonItemId));
          break;

        default:
          throw new Error(`Unsupported lesson item type: ${lessonItemType}`);
      }

      return await trx
        .delete(lessonItems)
        .where(eq(lessonItems.lessonItemId, lessonItemId))
        .returning();
    });
  }

  async removeQuestionAnswerOptions(
    questionId: UUIDType,
    idsToDelete: UUIDType[],
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
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
      position: number;
    },
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;
    return await dbInstance
      .insert(questionAnswerOptions)
      .values({
        id: option.id,
        questionId,
        optionText: option.optionText,
        isCorrect: option.isCorrect,
        position: option.position,
      })
      .onConflictDoUpdate({
        target: questionAnswerOptions.id,
        set: {
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          position: option.position,
        },
      });
  }
}
