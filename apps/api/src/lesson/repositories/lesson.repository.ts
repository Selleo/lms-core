import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, courses, lessons, questions, studentLessonProgress } from "src/storage/schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { QuestionBody } from "src/lesson/lesson.schema";
import type * as schema from "src/storage/schema";

@Injectable()
export class LessonRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLesson(id: UUIDType) {
    const [lesson] = await this.db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  // TODO: check if is not a duplicate with method below
  async getLessonsByChapterId(chapterId: UUIDType) {
    return this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        type: lessons.type,
        description: sql<string>`${lessons.description}`,
        fileS3Key: sql<string | undefined>`${lessons.fileS3Key}`,
        fileType: sql<string | undefined>`${lessons.fileType}`,
        displayOrder: sql<number>`${lessons.displayOrder}`,
        questions: sql<QuestionBody[]>`
          COALESCE(
            (
              SELECT json_agg(questions_data)
              FROM (
                SELECT
                  ${questions.id} AS id,
                  ${questions.title} AS title,
                  ${questions.description} AS description,
                  ${questions.type} AS type,
                  ${questions.photoQuestionType} AS photoQuestionType,
                  ${questions.photoS3Key} AS photoS3Key,
                  ${questions.solutionExplanation} AS solutionExplanation,
                  ${questions.displayOrder} AS displayOrder,
                FROM ${questions}
                WHERE ${lessons.id} = ${questions.lessonId}
                ORDER BY ${questions.displayOrder}
              ) AS questions_data
            ), 
            '[]'::json
          )
        `,
      })
      .from(lessons)
      .where(eq(lessons.chapterId, chapterId))
      .orderBy(lessons.displayOrder);
  }

  async getLessonsForChapter(chapterId: UUIDType) {
    return this.db
      .select({
        title: lessons.title,
        type: lessons.type,
        displayOrder: sql<number>`${lessons.displayOrder}`,
        questions: sql<QuestionBody[]>`
          COALESCE(
            (
              SELECT json_agg(questions_data)
              FROM (
                SELECT
                  ${questions.id} AS id,
                  ${questions.title} AS title,
                  ${questions.description} AS description,
                  ${questions.type} AS type,
                  ${questions.photoQuestionType} AS photoQuestionType,
                  ${questions.photoS3Key} AS photoS3Key,
                  ${questions.solutionExplanation} AS solutionExplanation,
                  ${questions.displayOrder} AS displayOrder,
                FROM ${questions}
                WHERE ${lessons.id} = ${questions.lessonId}
                ORDER BY ${questions.displayOrder}
              ) AS questions_data
            ), 
            '[]'::json
          )
        `,
      })
      .from(lessons)
      .where(eq(lessons.chapterId, chapterId))
      .orderBy(lessons.displayOrder);
  }

  async completeQuiz(
    chapterId: UUIDType,
    lessonId: UUIDType,
    userId: UUIDType,
    completedQuestionCount: number,
    quizScore: number,
    trx: PostgresJsDatabase<typeof schema>,
  ) {
    return trx
      .insert(studentLessonProgress)
      .values({
        studentId: userId,
        lessonId,
        chapterId,
        completedAt: sql`now()`,
        completedQuestionCount,
        quizScore,
      })
      .onConflictDoUpdate({
        target: [
          studentLessonProgress.studentId,
          studentLessonProgress.lessonId,
          studentLessonProgress.chapterId,
        ],
        set: {
          completedAt: sql`now()`,
          completedQuestionCount,
          quizScore,
        },
      })
      .returning();
  }

  async getLastInteractedOrNextLessonItemForUser(userId: UUIDType) {
    const [lastLesson] = await this.db
      .select({
        id: sql<string>`${studentLessonProgress.lessonId}`,
        chapterId: sql<string>`${chapters.id}`,
        courseId: sql<string>`${chapters.courseId}`,
        courseTitle: sql<string>`${courses.title}`,
        courseDescription: sql<string>`${courses.description}`,
      })
      .from(studentLessonProgress)
      .leftJoin(chapters, eq(chapters.id, studentLessonProgress.chapterId))
      .leftJoin(courses, eq(courses.id, chapters.courseId))
      .where(
        and(eq(studentLessonProgress.studentId, userId), isNull(studentLessonProgress.completedAt)),
      )
      .orderBy(desc(studentLessonProgress.createdAt))
      .limit(1);

    return lastLesson;
  }

  async getLessonsProgressByCourseId(
    courseId: UUIDType,
    userId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance
      .select({
        lessonId: studentLessonProgress.lessonId,
        completedLessonCount: studentLessonProgress.completedQuestionCount,
        quizCompleted: studentLessonProgress.completedAt,
        quizScore: studentLessonProgress.quizScore,
      })
      .from(studentLessonProgress)
      .leftJoin(lessons, eq(studentLessonProgress.lessonId, lessons.id))
      .leftJoin(chapters, eq(lessons.chapterId, chapters.id))
      .where(and(eq(chapters.courseId, courseId), eq(studentLessonProgress.studentId, userId)));
  }

  //   async setCorrectAnswerForStudentAnswer(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     questionId: UUIDType,
  //     userId: UUIDType,
  //     isCorrect: boolean,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance
  //       .update(studentQuestionAnswers)
  //       .set({
  //         isCorrect,
  //       })
  //       .where(
  //         and(
  //           eq(studentQuestionAnswers.studentId, userId),
  //           eq(studentQuestionAnswers.questionId, questionId),
  //           eq(studentQuestionAnswers.lessonId, lessonId),
  //           eq(studentQuestionAnswers.courseId, courseId),
  //         ),
  //       );
  //   }

  //   async retireQuizProgress(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     userId: UUIDType,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance
  //       .update(studentLessonsProgress)
  //       .set({ quizCompleted: false })
  //       .where(
  //         and(
  //           eq(studentLessonsProgress.studentId, userId),
  //           eq(studentLessonsProgress.lessonId, lessonId),
  //           eq(studentLessonsProgress.courseId, courseId),
  //         ),
  //       );
  //   }

  //   async removeStudentCompletedLessonItems(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     userId: UUIDType,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     // TODO: remove this function, not deleting from the database, only clearing variables
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance
  //       .delete(studentCompletedLessonItems)
  //       .where(
  //         and(
  //           eq(studentCompletedLessonItems.studentId, userId),
  //           eq(studentCompletedLessonItems.lessonId, lessonId),
  //           eq(studentCompletedLessonItems.courseId, courseId),
  //         ),
  //       );
  //   }

  //   async updateStudentLessonProgress(userId: UUIDType, lessonId: UUIDType, courseId: UUIDType) {
  //     return await this.db
  //       .update(studentLessonsProgress)
  //       .set({
  //         completedLessonItemCount: sql<number>`
  //           (SELECT COUNT(*)
  //           FROM ${studentCompletedLessonItems}
  //           WHERE ${studentCompletedLessonItems.lessonId} = ${lessonId}
  //             AND ${studentCompletedLessonItems.courseId} = ${courseId}
  //             AND ${studentCompletedLessonItems.studentId} = ${userId})`,
  //       })
  //       .where(
  //         and(
  //           eq(studentLessonsProgress.courseId, courseId),
  //           eq(studentLessonsProgress.lessonId, lessonId),
  //           eq(studentLessonsProgress.studentId, userId),
  //         ),
  //       )
  //       .returning();
  //   }

  //   async completeLessonProgress(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     userId: UUIDType,
  //     completedAsFreemium: boolean,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance
  //       .update(studentLessonsProgress)
  //       .set({
  //         completedAt: sql<string>`now()`,
  //         completedAsFreemium,
  //       })
  //       .where(
  //         and(
  //           eq(studentLessonsProgress.courseId, courseId),
  //           eq(studentLessonsProgress.lessonId, lessonId),
  //           eq(studentLessonsProgress.studentId, userId),
  //         ),
  //       );
  //   }
}
