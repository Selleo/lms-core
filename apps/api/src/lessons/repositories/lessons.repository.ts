import { Inject, Injectable } from "@nestjs/common";
import { and, count, eq, inArray, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { STATES } from "src/common/states";
import { QUESTION_TYPE } from "src/questions/schema/questions.types";
import {
  courseLessons,
  files,
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentCompletedLessonItems,
  studentCourses,
  studentLessonsProgress,
  studentQuestionAnswers,
  textBlocks,
} from "src/storage/schema";

import { LESSON_TYPE } from "../lesson.type";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class LessonsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLessonForUser(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const [lesson] = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        type: sql<string>`${lessons.type}`,
        isSubmitted: sql<boolean>`
          CASE
            WHEN ${studentLessonsProgress.quizCompleted} IS NOT NULL THEN ${studentLessonsProgress.quizCompleted}
            ELSE FALSE
          END
        `,
        isFree: courseLessons.isFree,
      })
      .from(lessons)
      .innerJoin(
        courseLessons,
        and(eq(courseLessons.lessonId, lessons.id), eq(courseLessons.courseId, courseId)),
      )
      .leftJoin(
        studentLessonsProgress,
        and(
          eq(studentLessonsProgress.courseId, courseId),
          eq(studentLessonsProgress.lessonId, lessonId),
          eq(studentLessonsProgress.studentId, userId),
        ),
      )
      .where(
        and(
          eq(lessons.id, lessonId),
          eq(lessons.archived, false),
          eq(lessons.state, STATES.published),
        ),
      );

    return lesson;
  }

  async getQuestionItems(
    lessonId: UUIDType,
    studentId: UUIDType,
    lessonType: string,
    lessonRated: boolean,
  ) {
    return await this.db
      .select({
        lessonItemType: lessonItems.lessonItemType,
        lessonItemId: lessonItems.id,
        questionData: questions,
        displayOrder: lessonItems.displayOrder,
        passQuestion: sql<boolean | null>`
          CASE
            WHEN ${lessonType} = ${LESSON_TYPE.quiz.key} AND ${lessonRated} THEN
              ${studentQuestionAnswers.isCorrect}
            ELSE null
          END
        `,
      })
      .from(lessonItems)
      .leftJoin(
        questions,
        and(
          eq(lessonItems.lessonItemId, questions.id),
          eq(lessonItems.lessonItemType, "question"),
          eq(questions.state, STATES.published),
        ),
      )
      .leftJoin(
        studentQuestionAnswers,
        and(
          eq(studentQuestionAnswers.questionId, questions.id),
          eq(studentQuestionAnswers.studentId, studentId),
          eq(studentQuestionAnswers.lessonId, lessonId),
        ),
      )
      .where(eq(lessonItems.lessonId, lessonId))
      .orderBy(lessonItems.displayOrder);
  }

  async getLessonItems(lessonId: UUIDType) {
    return await this.db
      .select({
        lessonItemType: lessonItems.lessonItemType,
        lessonItemId: lessonItems.id,
        questionData: questions,
        textBlockData: textBlocks,
        fileData: files,
        displayOrder: lessonItems.displayOrder,
      })
      .from(lessonItems)
      .leftJoin(
        questions,
        and(
          eq(lessonItems.lessonItemId, questions.id),
          eq(lessonItems.lessonItemType, "question"),
          eq(questions.state, STATES.published),
        ),
      )
      .leftJoin(
        textBlocks,
        and(
          eq(lessonItems.lessonItemId, textBlocks.id),
          eq(lessonItems.lessonItemType, "text_block"),
          eq(textBlocks.state, STATES.published),
        ),
      )
      .leftJoin(
        files,
        and(
          eq(lessonItems.lessonItemId, files.id),
          eq(lessonItems.lessonItemType, "file"),
          eq(files.state, STATES.published),
        ),
      )
      .where(and(eq(lessonItems.lessonId, lessonId)))
      .orderBy(lessonItems.displayOrder);
  }

  async getQuestionAnswers(
    questionId: UUIDType,
    userId: UUIDType,
    courseId: UUIDType,
    lessonId: UUIDType,
    lessonType: string,
    lessonRated: boolean,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select({
        id: questionAnswerOptions.id,
        optionText: questionAnswerOptions.optionText,
        position: questionAnswerOptions.position,
        isStudentAnswer: sql<boolean | null>`
          CASE
            WHEN ${studentQuestionAnswers.id} IS NULL THEN NULL
            WHEN ${studentQuestionAnswers.answer}->>CAST(${questionAnswerOptions.position} AS text) = ${questionAnswerOptions.optionText} AND
              ${questions.questionType} IN (${QUESTION_TYPE.fill_in_the_blanks_dnd.key}, ${QUESTION_TYPE.fill_in_the_blanks_text.key})
              THEN TRUE
            WHEN EXISTS (
                SELECT 1
                FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
                WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(${questionAnswerOptions.optionText})
              ) AND  ${questions.questionType} NOT IN (${QUESTION_TYPE.fill_in_the_blanks_dnd.key}, ${QUESTION_TYPE.fill_in_the_blanks_text.key})
              THEN TRUE
            ELSE FALSE
          END
          `,
        isCorrect: sql<boolean | null>`
          CASE
            WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
              ${questionAnswerOptions.isCorrect}
            ELSE NULL
          END
        `,
      })
      .from(questionAnswerOptions)
      .leftJoin(questions, eq(questionAnswerOptions.questionId, questions.id))
      .leftJoin(
        studentQuestionAnswers,
        and(
          eq(studentQuestionAnswers.questionId, questionAnswerOptions.questionId),
          eq(studentQuestionAnswers.lessonId, lessonId),
          eq(studentQuestionAnswers.courseId, courseId),
          eq(studentQuestionAnswers.studentId, userId),
        ),
      )
      .where(eq(questionAnswerOptions.questionId, questionId))
      .groupBy(
        questionAnswerOptions.id,
        questionAnswerOptions.optionText,
        questionAnswerOptions.position,
        studentQuestionAnswers.id,
        studentQuestionAnswers.answer,
        questions.questionType,
      );
  }

  async checkLessonAssignment(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    return this.db
      .select({
        id: lessons.id,
        studentCourseId: studentCourses.id,
      })
      .from(lessons)
      .leftJoin(courseLessons, eq(courseLessons.lessonId, lessons.id))
      .leftJoin(
        studentCourses,
        and(eq(studentCourses.courseId, courseId), eq(studentCourses.studentId, userId)),
      )
      .where(
        and(
          eq(studentCourses.courseId, courseId),
          eq(lessons.archived, false),
          eq(lessons.id, lessonId),
          eq(lessons.state, STATES.published),
        ),
      );
  }

  async completedLessonItem(courseId: UUIDType, lessonId: UUIDType) {
    return await this.db
      .selectDistinct({
        lessonItemId: studentCompletedLessonItems.lessonItemId,
      })
      .from(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.lessonId, lessonId),
          eq(studentCompletedLessonItems.courseId, courseId),
        ),
      );
  }

  async lessonProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const [lessonProgress] = await this.db
      .select({
        quizCompleted: sql<boolean>`
          CASE
            WHEN ${studentLessonsProgress.quizCompleted} THEN
              ${studentLessonsProgress.quizCompleted}
            ELSE false
          END`,
        lessonItemCount: studentLessonsProgress.lessonItemCount,
        completedLessonItemCount: studentLessonsProgress.completedLessonItemCount,
        quizScore: studentLessonsProgress.quizScore,
      })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          eq(studentLessonsProgress.lessonId, lessonId),
          eq(studentLessonsProgress.courseId, courseId),
        ),
      );

    return lessonProgress;
  }

  async getLessonItemCount(lessonId: UUIDType) {
    const [lessonItemCount] = await this.db
      .select({ count: count(lessonItems.id) })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId));

    return lessonItemCount;
  }

  async completedLessonItemsCount(courseId: UUIDType, lessonId: UUIDType) {
    const [completedLessonItemsCount] = await this.db
      .selectDistinct({
        count: count(studentCompletedLessonItems.id),
      })
      .from(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.lessonId, lessonId),
          eq(studentCompletedLessonItems.courseId, courseId),
        ),
      );

    return completedLessonItemsCount;
  }

  async getQuizScore(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const questions = await this.db
      .select({
        questionId: lessonItems.lessonItemId,
      })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId));

    const questionIds = questions.map((question) => question.questionId);

    const [quizScore] = await this.db
      .select({
        quizScore: sql<number>`sum(case when ${studentQuestionAnswers.isCorrect} then 1 else 0 end)`,
      })
      .from(studentQuestionAnswers)
      .where(
        and(
          eq(studentQuestionAnswers.studentId, userId),
          inArray(studentQuestionAnswers.questionId, questionIds),
        ),
      )
      .groupBy(studentQuestionAnswers.studentId);

    return quizScore.quizScore;
  }

  async completeQuiz(
    courseId: UUIDType,
    lessonId: UUIDType,
    userId: UUIDType,
    completedLessonItemCount: number,
    quizScore: number,
  ) {
    return await this.db
      .insert(studentLessonsProgress)
      .values({
        studentId: userId,
        lessonId: lessonId,
        courseId: courseId,
        quizCompleted: true,
        lessonItemCount: completedLessonItemCount,
        completedLessonItemCount,
        quizScore,
      })
      .onConflictDoUpdate({
        target: [
          studentLessonsProgress.studentId,
          studentLessonsProgress.lessonId,
          studentLessonsProgress.courseId,
        ],
        set: {
          quizCompleted: true,
          completedLessonItemCount,
          quizScore,
        },
      })
      .returning();
  }

  async getQuizProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const [quizProgress] = await this.db
      .select({
        quizCompleted: sql<boolean>`
          CASE
            WHEN ${studentLessonsProgress.quizCompleted} THEN
              ${studentLessonsProgress.quizCompleted}
            ELSE false
          END`,
      })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          eq(studentLessonsProgress.lessonId, lessonId),
          eq(studentLessonsProgress.courseId, courseId),
        ),
      );

    return quizProgress;
  }

  async getQuestionsIdsByLessonId(lessonId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    const questionIds = await dbInstance
      .select({
        questionId: studentQuestionAnswers.questionId,
      })
      .from(studentQuestionAnswers)
      .leftJoin(lessonItems, eq(studentQuestionAnswers.questionId, lessonItems.lessonItemId))
      .where(eq(lessonItems.lessonId, lessonId));

    return questionIds;
  }

  async getOpenQuestionStudentAnswer(
    lessonId: UUIDType,
    questionId: UUIDType,
    userId: UUIDType,
    lessonType: string,
    lessonRated: boolean,
  ) {
    return await this.db
      .select({
        id: studentQuestionAnswers.id,
        optionText: sql<string>`${studentQuestionAnswers.answer}->'1'`,
        isStudentAnswer: sql<boolean>`true`,
        position: sql<number>`1`,
        isCorrect: sql<boolean | null>`
          CASE
            WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
              ${studentQuestionAnswers.isCorrect}
            ELSE null
          END
        `,
      })
      .from(studentQuestionAnswers)
      .where(
        and(
          eq(studentQuestionAnswers.lessonId, lessonId),
          eq(studentQuestionAnswers.questionId, questionId),
          eq(studentQuestionAnswers.studentId, userId),
        ),
      )

      .limit(1);
  }

  async getFillInTheBlanksStudentAnswers(
    userId: UUIDType,
    questionId: UUIDType,
    lessonId: UUIDType,
  ) {
    return await this.db
      .select({
        id: studentQuestionAnswers.id,
        answer: sql<Record<string, string>>`${studentQuestionAnswers.answer}`,
        isCorrect: studentQuestionAnswers.isCorrect,
      })
      .from(studentQuestionAnswers)
      .where(
        and(
          eq(studentQuestionAnswers.lessonId, lessonId),
          eq(studentQuestionAnswers.questionId, questionId),
          eq(studentQuestionAnswers.studentId, userId),
        ),
      )
      .limit(1);
  }

  async removeQuestionsAnswer(
    courseId: UUIDType,
    lessonId: UUIDType,
    questionIds: { questionId: string }[],
    userId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(studentQuestionAnswers).where(
      and(
        eq(studentQuestionAnswers.courseId, courseId),
        eq(studentQuestionAnswers.lessonId, lessonId),
        eq(studentQuestionAnswers.studentId, userId),
        inArray(
          studentQuestionAnswers.questionId,
          questionIds.map((q) => q.questionId),
        ),
      ),
    );
  }

  async setCorrectAnswerForStudentAnswer(
    courseId: UUIDType,
    lessonId: UUIDType,
    questionId: UUIDType,
    userId: UUIDType,
    isCorrect: boolean,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .update(studentQuestionAnswers)
      .set({
        isCorrect,
      })
      .where(
        and(
          eq(studentQuestionAnswers.studentId, userId),
          eq(studentQuestionAnswers.questionId, questionId),
          eq(studentQuestionAnswers.lessonId, lessonId),
          eq(studentQuestionAnswers.courseId, courseId),
        ),
      );
  }

  async retireQuizProgress(
    courseId: UUIDType,
    lessonId: UUIDType,
    userId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .update(studentLessonsProgress)
      .set({ quizCompleted: false })
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          eq(studentLessonsProgress.lessonId, lessonId),
          eq(studentLessonsProgress.courseId, courseId),
        ),
      );
  }

  async removeStudentCompletedLessonItems(
    courseId: UUIDType,
    lessonId: UUIDType,
    userId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .delete(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.studentId, userId),
          eq(studentCompletedLessonItems.lessonId, lessonId),
          eq(studentCompletedLessonItems.courseId, courseId),
        ),
      );
  }
}
