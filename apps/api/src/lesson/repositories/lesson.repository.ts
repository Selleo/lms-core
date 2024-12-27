import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, lessons, questions, studentLessonProgress } from "src/storage/schema";

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
                  -- TODO: add display order
                FROM ${questions}
                WHERE ${lessons.id} = ${questions.lessonId}
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
                  -- TODO: add display order
                FROM ${questions}
                WHERE ${lessons.id} = ${questions.lessonId}
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

  //   async completeQuiz(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     userId: UUIDType,
  //     completedLessonItemCount: number,
  //     quizScore: number,
  //   ) {
  //     return await this.db
  //       .insert(studentLessonsProgress)
  //       .values({
  //         studentId: userId,
  //         lessonId: lessonId,
  //         courseId: courseId,
  //         quizCompleted: true,
  //         completedLessonItemCount,
  //         quizScore,
  //       })
  //       .onConflictDoUpdate({
  //         target: [
  //           studentLessonsProgress.studentId,
  //           studentLessonsProgress.lessonId,
  //           studentLessonsProgress.courseId,
  //         ],
  //         set: {
  //           quizCompleted: true,
  //           completedLessonItemCount,
  //           quizScore,
  //         },
  //       })
  //       .returning();
  //   }

  //   async getLastInteractedOrNextLessonItemForUser(userId: UUIDType) {
  //     const [lastLessonItem] = await this.db
  //       .select({
  //         id: sql<string>`${studentCompletedLessonItems.lessonItemId}`,
  //         lessonId: sql<string>`${studentCompletedLessonItems.lessonId}`,
  //         courseId: sql<string>`${studentCompletedLessonItems.courseId}`,
  //         courseTitle: sql<string>`${courses.title}`,
  //         courseDescription: sql<string>`${courses.description}`,
  //       })
  //       .from(studentLessonsProgress)
  //       .leftJoin(studentCompletedLessonItems, and(eq(studentCompletedLessonItems.studentId, userId)))
  //       .where(
  //         and(
  //           eq(studentCompletedLessonItems.studentId, userId),
  //           eq(studentLessonsProgress.lessonId, studentCompletedLessonItems.lessonId),
  //           eq(studentLessonsProgress.courseId, studentCompletedLessonItems.courseId),
  //           isNull(studentLessonsProgress.completedAt),
  //         ),
  //       )
  //       .leftJoin(courses, eq(studentCompletedLessonItems.courseId, courses.id))
  //       .orderBy(desc(studentCompletedLessonItems.updatedAt))
  //       .limit(1);

  //     return lastLessonItem;
  //   }

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
