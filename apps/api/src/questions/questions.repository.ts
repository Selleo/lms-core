import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import {
  lessons,
  questionAnswerOptions,
  questions,
  studentQuestionAnswers,
} from "src/storage/schema";

import type { AnswerQuestionSchema, QuestionSchema } from "./schema/question.schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class QuestionsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getQuestions(
    answerQuestion: AnswerQuestionSchema,
    trx?: PostgresJsDatabase<typeof schema>,
  ): Promise<QuestionSchema> {
    const dbInstance = trx ?? this.db;

    const [questionData] = await dbInstance
      .select({
        lessonId: lessons.id,
        questionId: sql<string>`${questions.id}`,
        questionType: sql<string>`${questions.type}`,
      })
      .from(lessons)
      .leftJoin(questions, and(eq(questions.lessonId, lessons.id)))
      .where(and(eq(lessons.id, answerQuestion.lessonId)));

    return questionData;
  }

  async findExistingAnswer(
    userId: UUIDType,
    questionId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ): Promise<UUIDType | null> {
    const dbInstance = trx ?? this.db;
    const [existingAnswer] = await dbInstance
      .select({
        id: studentQuestionAnswers.id,
      })
      .from(studentQuestionAnswers)
      .where(
        and(
          eq(studentQuestionAnswers.studentId, userId),
          eq(studentQuestionAnswers.questionId, questionId),
        ),
      );

    return existingAnswer?.id;
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

  async getQuestionAnswersById(questionId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
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

  async getQuestionAnswers(
    questionId: UUIDType,
    answerList: string[],
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select({
        answer: questionAnswerOptions.optionText,
      })
      .from(questionAnswerOptions)
      .where(
        and(
          eq(questionAnswerOptions.questionId, questionId),
          inArray(questionAnswerOptions.id, answerList),
        ),
      );
  }

  async deleteAnswer(answerId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .delete(studentQuestionAnswers)
      .where(eq(studentQuestionAnswers.id, answerId));
  }

  async updateQuestionDisplayOrder(
    questionId: UUIDType,
    oldDisplayOrder: number,
    newDisplayOrder: number,
    questionToUpdateId: UUIDType,
  ): Promise<void> {
    await this.db.transaction(async (trx) => {
      await trx
        .update(questions)
        .set({
          displayOrder: sql`CASE
            WHEN ${eq(questions.id, questionId)}
              THEN ${newDisplayOrder}
            WHEN ${newDisplayOrder < oldDisplayOrder}
              AND ${gte(questions.displayOrder, newDisplayOrder)}
              AND ${lte(questions.displayOrder, oldDisplayOrder)}
              THEN ${questions.displayOrder} + 1
            WHEN ${newDisplayOrder > oldDisplayOrder}
              AND ${lte(questions.displayOrder, newDisplayOrder)}
              AND ${gte(questions.displayOrder, oldDisplayOrder)}
              THEN ${questions.displayOrder} - 1
            ELSE ${questions.displayOrder}
          END`,
        })
        .where(eq(questions.id, questionToUpdateId));
    });
  }

  async updateQuestionAnswerDisplayOrder(
    questionAnswerId: UUIDType,
    oldDisplayOrder: number,
    newDisplayOrder: number,
    questionAnswerToUpdateId: UUIDType,
  ): Promise<void> {
    await this.db.transaction(async (trx) => {
      await trx
        .update(questions)
        .set({
          displayOrder: sql`CASE
            WHEN ${eq(questionAnswerOptions.id, questionAnswerId)}
              THEN ${newDisplayOrder}
            WHEN ${newDisplayOrder < oldDisplayOrder}
              AND ${gte(questionAnswerOptions.displayOrder, newDisplayOrder)}
              AND ${lte(questionAnswerOptions.displayOrder, oldDisplayOrder)}
              THEN ${questionAnswerOptions.displayOrder} + 1
            WHEN ${newDisplayOrder > oldDisplayOrder}
              AND ${lte(questionAnswerOptions.displayOrder, newDisplayOrder)}
              AND ${gte(questionAnswerOptions.displayOrder, oldDisplayOrder)}
              THEN ${questionAnswerOptions.displayOrder} - 1
            ELSE ${questionAnswerOptions.displayOrder}
          END`,
        })
        .where(eq(questionAnswerOptions.id, questionAnswerToUpdateId));
    });
  }

  async upsertAnswer(
    questionId: UUIDType,
    userId: UUIDType,
    answerId: UUIDType | null,
    answer: string[],
    trx?: PostgresJsDatabase<typeof schema>,
  ): Promise<void> {
    const jsonBuildObjectArgs = answer.join(",");
    const dbInstance = trx ?? this.db;

    if (answerId) {
      await dbInstance
        .update(studentQuestionAnswers)
        .set({
          answer: sql`json_build_object(${sql.raw(jsonBuildObjectArgs)})`,
        })
        .where(eq(studentQuestionAnswers.id, answerId));
      return;
    }

    await dbInstance.insert(studentQuestionAnswers).values({
      questionId,
      answer: sql`json_build_object(${sql.raw(jsonBuildObjectArgs)})`,
      studentId: userId,
    });

    return;
  }
}
