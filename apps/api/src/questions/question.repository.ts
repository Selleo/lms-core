import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import {
  lessons,
  questionAnswerOptions,
  questions,
  studentQuestionAnswers,
} from "src/storage/schema";

import type { AnswerQuestionSchema, QuestionSchema } from "./schema/question.schema";
import type { QuestionTypes } from "./schema/question.types";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class QuestionRepository {
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

  // TODO: check if it work correctly
  async getQuizQuestionsToEvaluation(lessonId: UUIDType) {
    return this.db
      .select({
        id: questions.id,
        type: sql<QuestionTypes>`${questions.type}`,
        correctAnswers: sql<{ answerId: UUIDType; displayOrder: number; value: string }[]>`
          (
            SELECT ARRAY(
              SELECT json_build_object(
                'answerId', ${questionAnswerOptions.id},
                'displayOrder', ${questionAnswerOptions.displayOrder},
                'value', ${questionAnswerOptions.optionText}
              )
              FROM ${questionAnswerOptions}
              WHERE ${questionAnswerOptions.questionId} = ${questions.id} AND ${questionAnswerOptions.isCorrect} = TRUE
              GROUP BY ${questionAnswerOptions.displayOrder}, ${questionAnswerOptions.id}, ${questionAnswerOptions.optionText}
              ORDER BY ${questionAnswerOptions.displayOrder}
            )
          )
        `,
        allAnswers: sql<{ answerId: UUIDType; displayOrder: number; value: string }[]>`
          (
            SELECT ARRAY(
              SELECT json_build_object(
                'answerId', ${questionAnswerOptions.id},
                'displayOrder', ${questionAnswerOptions.displayOrder},
                'value', ${questionAnswerOptions.optionText}
              )
              FROM ${questionAnswerOptions}
              WHERE ${questionAnswerOptions.questionId} = ${questions.id}
              GROUP BY ${questionAnswerOptions.displayOrder}, ${questionAnswerOptions.id}, ${questionAnswerOptions.optionText}
              ORDER BY ${questionAnswerOptions.displayOrder}
            )
          )
        `,
      })
      .from(questions)
      .leftJoin(questionAnswerOptions, eq(questions.id, questionAnswerOptions.questionId))
      .where(and(eq(questions.lessonId, lessonId), eq(questionAnswerOptions.isCorrect, true)))
      .orderBy(questions.displayOrder);
  }

  async insertQuizAnswers(
    answers: {
      questionId: string;
      answer: unknown;
      studentId: string;
      isCorrect: boolean;
    }[],
    trx: PostgresJsDatabase<typeof schema>,
  ) {
    return trx.insert(studentQuestionAnswers).values(answers);
  }
}
