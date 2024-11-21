import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import {
  lessonItems,
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

  async fetchQuestionData(
    answerQuestion: AnswerQuestionSchema,
    trx?: PostgresJsDatabase<typeof schema>,
  ): Promise<QuestionSchema> {
    const dbInstance = trx ?? this.db;

    const [questionData] = await dbInstance
      .select({
        lessonId: lessons.id,
        questionId: sql<string>`${questions.id}`,
        questionType: sql<string>`${questions.questionType}`,
        lessonItemAssociationId: lessonItems.id,
      })
      .from(lessons)
      .innerJoin(
        lessonItems,
        and(
          eq(lessonItems.lessonId, answerQuestion.lessonId),
          eq(lessonItems.lessonItemId, answerQuestion.questionId),
        ),
      )
      .leftJoin(
        questions,
        and(
          eq(questions.id, lessonItems.lessonItemId),
          eq(questions.archived, false),
          eq(questions.state, "published"),
        ),
      )
      .where(
        and(
          eq(lessons.id, lessonItems.lessonId),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
        ),
      );

    return questionData;
  }

  async findExistingAnswer(
    userId: UUIDType,
    questionId: UUIDType,
    lessonId: UUIDType,
    courseId: UUIDType,
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
          eq(studentQuestionAnswers.lessonId, lessonId),
          eq(studentQuestionAnswers.courseId, courseId),
        ),
      );

    return existingAnswer?.id;
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

  async upsertAnswer(
    courseId: UUIDType,
    lessonId: UUIDType,
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
      lessonId,
      courseId,
    });

    return;
  }
}
