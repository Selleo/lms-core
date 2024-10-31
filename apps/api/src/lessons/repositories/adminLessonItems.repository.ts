import { Inject, Injectable } from "@nestjs/common";
import { eq, and, inArray } from "drizzle-orm";
import * as schema from "src/storage/schema";
import { DatabasePg, UUIDType } from "src/common";
import {
  lessonItems,
  files,
  questions,
  textBlocks,
  questionAnswerOptions,
} from "src/storage/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  LessonItemToAdd,
  LessonItemToRemove,
  UpdateFileBody,
  UpdateQuestionBody,
  UpdateTextBlockBody,
} from "../schemas/lessonItem.schema";

@Injectable()
export class AdminLessonItemsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getQuestions(conditions: any[]) {
    return await this.db
      .select()
      .from(questions)
      .where(and(...conditions));
  }

  async getQuestionAnswers(
    questionId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
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

  async getQuestionAnswerOptions(
    questionId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select()
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
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
        eq(lessonItems.id, lessonId),
        inArray(
          lessonItems.lessonItemId,
          items.map((item) => item.id),
        ),
      ),
    );
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
      id: string;
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
