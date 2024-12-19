import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, lessons, questions, studentLessonProgress } from "src/storage/schema";

// import { STATES } from "src/common/states";
// import { QUESTION_TYPE } from "src/questions/schema/questions.types";
// import {
//   chapters,
//   courses,
//   lessons,
//   questionAnswerOptions,
//   questions,
//   studentChapterProgress,
//   studentCourses,
//   studentQuestionAnswers,
// } from "src/storage/schema";
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
                -- ORDER BY ${lessons.displayOrder}
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

  //   async getChapterForUser(id: UUIDType, userId: UUIDType) {
  //     const [lesson] = await this.db
  //       .select({
  //         id: chapters.id,
  //         title: chapters.title,
  //         isFree: chapters.isFreemium,
  //         enrolled: sql<boolean>`CASE WHEN ${studentCourses.id} IS NOT NULL THEN true ELSE false END`,
  //         itemsCount: chapters.lessonCount,
  //       })
  //       .from(chapters)
  //       .leftJoin(
  //         studentChapterProgress,
  //         and(
  //           eq(studentChapterProgress.courseId, chapters.courseId),
  //           eq(studentChapterProgress.chapterId, chapters.id),
  //           eq(studentChapterProgress.studentId, userId),
  //         ),
  //       )
  //       .leftJoin(
  //         studentCourses,
  //         and(eq(studentCourses.courseId, chapters.courseId), eq(studentCourses.studentId, userId)),
  //       )
  //       .where(and(eq(chapters.id, id), eq(chapters.isPublished, true)));

  //     return lesson;
  //   }

  //   async getChapter(id: UUIDType) {
  //     const [lesson] = await this.db
  //       .select({
  //         id: chapters.id,
  //         title: chapters.title,
  //         isFree: chapters.isFreemium,
  //         itemsCount: chapters.lessonCount,
  //       })
  //       .from(chapters)
  //       .where(and(eq(chapters.id, id), eq(chapters.isPublished, true)));

  //     return lesson;
  //   }

  //   async getQuestionItems(
  //     lessonId: UUIDType,
  //     studentId: UUIDType,
  //     lessonType: string,
  //     lessonRated: boolean,
  //   ) {
  //     return await this.db
  //       .select({
  //         lessonItemType: lessonItems.lessonItemType,
  //         lessonItemId: lessonItems.id,
  //         questionData: questions,
  //         displayOrder: lessonItems.displayOrder,
  //         passQuestion: sql<boolean | null>`
  //                     CASE
  //             WHEN ${lessonType} = ${LESSON_TYPE.quiz.key} AND ${lessonRated} THEN
  //                     ${studentQuestionAnswers.isCorrect}
  //                     ELSE null
  //                     END
  //                 `,
  //       })
  //       .from(lessonItems)
  //       .leftJoin(
  //         questions,
  //         and(
  //           eq(lessonItems.lessonItemId, questions.id),
  //           eq(lessonItems.lessonItemType, "question"),
  //           eq(questions.state, STATES.published),
  //         ),
  //       )
  //       .leftJoin(
  //         studentQuestionAnswers,
  //         and(
  //           eq(studentQuestionAnswers.questionId, questions.id),
  //           eq(studentQuestionAnswers.studentId, studentId),
  //           eq(studentQuestionAnswers.lessonId, lessonId),
  //         ),
  //       )
  //       .where(eq(lessonItems.lessonId, lessonId))
  //       .orderBy(lessonItems.displayOrder);
  //   }

  //   async getLessonItems(lessonId: UUIDType, courseId: UUIDType) {
  //     return await this.db
  //       .select({
  //         lessonItemType: lessonItems.lessonItemType,
  //         lessonItemId: lessonItems.id,
  //         questionData: questions,
  //         textBlockData: textBlocks,
  //         fileData: files,
  //         displayOrder: lessonItems.displayOrder,
  //         isCompleted: sql<boolean>`CASE WHEN ${studentCompletedLessonItems.id} IS NOT NULL THEN true ELSE false END`,
  //       })
  //       .from(lessonItems)
  //       .leftJoin(
  //         questions,
  //         and(
  //           eq(lessonItems.lessonItemId, questions.id),
  //           eq(lessonItems.lessonItemType, "question"),
  //           eq(questions.state, STATES.published),
  //         ),
  //       )
  //       .leftJoin(
  //         textBlocks,
  //         and(
  //           eq(lessonItems.lessonItemId, textBlocks.id),
  //           eq(lessonItems.lessonItemType, "text_block"),
  //           eq(textBlocks.state, STATES.published),
  //         ),
  //       )
  //       .leftJoin(
  //         files,
  //         and(
  //           eq(lessonItems.lessonItemId, files.id),
  //           eq(lessonItems.lessonItemType, "file"),
  //           eq(files.state, STATES.published),
  //         ),
  //       )
  //       .leftJoin(
  //         studentCompletedLessonItems,
  //         and(
  //           eq(studentCompletedLessonItems.lessonItemId, lessonItems.id),
  //           eq(studentCompletedLessonItems.lessonId, lessonId),
  //           eq(studentCompletedLessonItems.courseId, courseId),
  //         ),
  //       )
  //       .where(and(eq(lessonItems.lessonId, lessonId)))
  //       .orderBy(lessonItems.displayOrder);
  //   }

  //   async getQuestionAnswers(
  //     questionId: UUIDType,
  //     userId: UUIDType,
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     lessonType: string,
  //     lessonRated: boolean,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance
  //       .select({
  //         id: questionAnswerOptions.id,
  //         optionText: questionAnswerOptions.optionText,
  //         position: questionAnswerOptions.position,
  //         isStudentAnswer: sql<boolean | null>`
  //                     CASE
  //             WHEN ${studentQuestionAnswers.id} IS NULL THEN NULL
  //                     WHEN ${studentQuestionAnswers.answer}->>CAST(${questionAnswerOptions.position} AS text) = ${questionAnswerOptions.optionText} AND
  //                     ${questions.questionType} IN (${QUESTION_TYPE.fill_in_the_blanks_dnd.key}, ${QUESTION_TYPE.fill_in_the_blanks_text.key})
  //                     THEN TRUE
  //                     WHEN EXISTS (
  //                     SELECT 1
  //                     FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
  //                     WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(${questionAnswerOptions.optionText})
  //                     ) AND  ${questions.questionType} NOT IN (${QUESTION_TYPE.fill_in_the_blanks_dnd.key}, ${QUESTION_TYPE.fill_in_the_blanks_text.key})
  //                     THEN TRUE
  //                     ELSE FALSE
  //                     END
  //                 `,
  //         isCorrect: sql<boolean | null>`
  //                     CASE
  //             WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
  //                     ${questionAnswerOptions.isCorrect}
  //                     ELSE NULL
  //                     END
  //                 `,
  //       })
  //       .from(questionAnswerOptions)
  //       .leftJoin(questions, eq(questionAnswerOptions.questionId, questions.id))
  //       .leftJoin(
  //         studentQuestionAnswers,
  //         and(
  //           eq(studentQuestionAnswers.questionId, questionAnswerOptions.questionId),
  //           eq(studentQuestionAnswers.lessonId, lessonId),
  //           eq(studentQuestionAnswers.courseId, courseId),
  //           eq(studentQuestionAnswers.studentId, userId),
  //         ),
  //       )
  //       .where(eq(questionAnswerOptions.questionId, questionId))
  //       .groupBy(
  //         questionAnswerOptions.id,
  //         questionAnswerOptions.optionText,
  //         questionAnswerOptions.position,
  //         studentQuestionAnswers.id,
  //         studentQuestionAnswers.answer,
  //         questions.questionType,
  //       );
  //   }

  //   async checkLessonAssignment(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //     return this.db
  //       .select({
  //         id: lessons.id,
  //         isFree: sql<boolean>`COALESCE(${courseLessons.isFree}, FALSE)`,
  //         isAssigned: sql<boolean>`CASE WHEN ${studentCourses.id} IS NOT NULL THEN true ELSE false END`,
  //       })
  //       .from(lessons)
  //       .leftJoin(
  //         courseLessons,
  //         and(eq(courseLessons.lessonId, lessons.id), eq(courseLessons.courseId, courseId)),
  //       )
  //       .leftJoin(
  //         studentCourses,
  //         and(eq(studentCourses.courseId, courseId), eq(studentCourses.studentId, userId)),
  //       )
  //       .where(
  //         and(
  //           eq(lessons.archived, false),
  //           eq(lessons.id, lessonId),
  //           eq(lessons.state, STATES.published),
  //         ),
  //       );
  //   }

  //   async completedLessonItem(courseId: UUIDType, lessonId: UUIDType) {
  //     return await this.db
  //       .selectDistinct({
  //         lessonItemId: studentCompletedLessonItems.lessonItemId,
  //       })
  //       .from(studentCompletedLessonItems)
  //       .where(
  //         and(
  //           eq(studentCompletedLessonItems.lessonId, lessonId),
  //           eq(studentCompletedLessonItems.courseId, courseId),
  //         ),
  //       );
  //   }

  //   async lessonProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType, isQuiz = false) {
  //     const conditions = [
  //       eq(studentLessonsProgress.studentId, userId),
  //       eq(studentLessonsProgress.lessonId, lessonId),
  //       eq(studentLessonsProgress.courseId, courseId),
  //     ];

  //     if (isQuiz) {
  //       conditions.push(eq(lessons.type, LESSON_TYPE.quiz.key));
  //     }

  //     const [lessonProgress] = await this.db
  //       .select({
  //         quizCompleted: sql<boolean>`
  //                     CASE
  //             WHEN ${studentLessonsProgress.quizCompleted} THEN
  //                     ${studentLessonsProgress.quizCompleted}
  //                     ELSE false
  //                     END`,
  //         lessonItemCount: lessons.itemsCount,
  //         completedLessonItemCount: studentLessonsProgress.completedLessonItemCount,
  //         quizScore: sql<number>`${studentLessonsProgress.quizScore}`,
  //       })
  //       .from(studentLessonsProgress)
  //       .leftJoin(lessons, eq(studentLessonsProgress.lessonId, lessons.id))
  //       .where(and(...conditions));

  //     return lessonProgress;
  //   }

  //   async getLessonItemCount(lessonId: UUIDType) {
  //     const [lessonItemCount] = await this.db
  //       .select({ count: count(lessonItems.id) })
  //       .from(lessonItems)
  //       .where(eq(lessonItems.lessonId, lessonId));

  //     return lessonItemCount;
  //   }

  //   async completedLessonItemsCount(courseId: UUIDType, lessonId: UUIDType) {
  //     const [completedLessonItemsCount] = await this.db
  //       .selectDistinct({
  //         count: count(studentCompletedLessonItems.id),
  //       })
  //       .from(studentCompletedLessonItems)
  //       .where(
  //         and(
  //           eq(studentCompletedLessonItems.lessonId, lessonId),
  //           eq(studentCompletedLessonItems.courseId, courseId),
  //         ),
  //       );

  //     return completedLessonItemsCount;
  //   }

  //   async getQuizScore(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //     const questions = await this.db
  //       .select({
  //         questionId: lessonItems.lessonItemId,
  //       })
  //       .from(lessonItems)
  //       .where(eq(lessonItems.lessonId, lessonId));

  //     const questionIds = questions.map((question) => question.questionId);

  //     const [quizScore] = await this.db
  //       .select({
  //         quizScore: sql<number>`sum(case when ${studentQuestionAnswers.isCorrect} then 1 else 0 end)`,
  //       })
  //       .from(studentQuestionAnswers)
  //       .where(
  //         and(
  //           eq(studentQuestionAnswers.studentId, userId),
  //           inArray(studentQuestionAnswers.questionId, questionIds),
  //         ),
  //       )
  //       .groupBy(studentQuestionAnswers.studentId);

  //     return quizScore.quizScore;
  //   }

  //   async getLessonsDetails(userId: UUIDType, courseId: UUIDType, lessonId?: UUIDType) {
  //     const conditions = [
  //       eq(courseLessons.courseId, courseId),
  //       eq(lessons.archived, false),
  //       eq(lessons.state, STATES.published),
  //       isNotNull(lessons.id),
  //       isNotNull(lessons.title),
  //       isNotNull(lessons.description),
  //       isNotNull(lessons.imageUrl),
  //     ];
  //     if (lessonId) conditions.push(eq(lessons.id, lessonId));

  //     return await this.db
  //       .select({
  //         id: lessons.id,
  //         title: lessons.title,
  //         type: lessons.type,
  //         isSubmitted: sql<boolean>`
  //           EXISTS (
  //             SELECT 1
  //             FROM ${studentLessonsProgress}
  //             WHERE ${studentLessonsProgress.lessonId} = ${lessons.id}
  //               AND ${studentLessonsProgress.courseId} = ${courseId}
  //               AND ${studentLessonsProgress.studentId} = ${userId}
  //               AND ${studentLessonsProgress.quizCompleted}
  //           )::BOOLEAN`,
  //         description: sql<string>`${lessons.description}`,
  //         imageUrl: sql<string>`${lessons.imageUrl}`,
  //         itemsCount: sql<number>`
  //           (SELECT COUNT(*)
  //           FROM ${lessonItems}
  //           WHERE ${lessonItems.lessonId} = ${lessons.id}
  //             AND ${lessonItems.lessonItemType} != ${LESSON_ITEM_TYPE.text_block.key})`,
  //         itemsCompletedCount: sql<number>`
  //           (SELECT COUNT(*)
  //           FROM ${studentCompletedLessonItems}
  //           WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
  //             AND ${studentCompletedLessonItems.courseId} = ${courseId}
  //             AND ${studentCompletedLessonItems.studentId} = ${userId})`,
  //         lessonProgress: sql<LessonProgressType>`
  //           (CASE
  //             WHEN (
  //               SELECT COUNT(*)
  //               FROM ${lessonItems}
  //               WHERE ${lessonItems.lessonId} = ${lessons.id}
  //                 AND ${lessonItems.lessonItemType} != ${LESSON_ITEM_TYPE.text_block.key}
  //             ) = (
  //               SELECT COUNT(*)
  //               FROM ${studentCompletedLessonItems}
  //               WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
  //                 AND ${studentCompletedLessonItems.courseId} = ${courseId}
  //                 AND ${studentCompletedLessonItems.studentId} = ${userId}
  //             )
  //             THEN ${LessonProgress.completed}
  //             WHEN (
  //               SELECT COUNT(*)
  //               FROM ${studentCompletedLessonItems}
  //               WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
  //                 AND ${studentCompletedLessonItems.courseId} = ${courseId}
  //                 AND ${studentCompletedLessonItems.studentId} = ${userId}
  //             ) > 0
  //             THEN ${LessonProgress.inProgress}
  //             ELSE ${LessonProgress.notStarted}
  //           END)
  //         `,
  //         isFree: courseLessons.isFree,
  //       })
  //       .from(courseLessons)
  //       .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
  //       .where(and(...conditions));
  //   }

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

  //   async getQuizProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //     const [quizProgress] = await this.db
  //       .select({
  //         quizCompleted: sql<boolean>`
  //           CASE
  //             WHEN ${studentLessonsProgress.quizCompleted} THEN
  //               ${studentLessonsProgress.quizCompleted}
  //             ELSE false
  //           END`,
  //         completedAt: sql<string>`${studentLessonsProgress.completedAt}`,
  //       })
  //       .from(studentLessonsProgress)
  //       .where(
  //         and(
  //           eq(studentLessonsProgress.studentId, userId),
  //           eq(studentLessonsProgress.lessonId, lessonId),
  //           eq(studentLessonsProgress.courseId, courseId),
  //         ),
  //       );

  //     return quizProgress;
  //   }

  //   async getQuestionsIdsByLessonId(lessonId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
  //     const dbInstance = trx ?? this.db;

  //     const questionIds = await dbInstance
  //       .select({
  //         questionId: studentQuestionAnswers.questionId,
  //       })
  //       .from(studentQuestionAnswers)
  //       .leftJoin(lessonItems, eq(studentQuestionAnswers.questionId, lessonItems.lessonItemId))
  //       .where(eq(lessonItems.lessonId, lessonId));

  //     return questionIds;
  //   }

  //   async getOpenQuestionStudentAnswer(
  //     lessonId: UUIDType,
  //     questionId: UUIDType,
  //     userId: UUIDType,
  //     lessonType: string,
  //     lessonRated: boolean,
  //   ) {
  //     return await this.db
  //       .select({
  //         id: studentQuestionAnswers.id,
  //         optionText: sql<string>`${studentQuestionAnswers.answer}->'1'`,
  //         isStudentAnswer: sql<boolean>`true`,
  //         position: sql<number>`1`,
  //         isCorrect: sql<boolean | null>`
  //           CASE
  //             WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
  //               ${studentQuestionAnswers.isCorrect}
  //             ELSE null
  //           END
  //         `,
  //       })
  //       .from(studentQuestionAnswers)
  //       .where(
  //         and(
  //           eq(studentQuestionAnswers.lessonId, lessonId),
  //           eq(studentQuestionAnswers.questionId, questionId),
  //           eq(studentQuestionAnswers.studentId, userId),
  //         ),
  //       )

  //       .limit(1);
  //   }

  //   async getFillInTheBlanksStudentAnswers(
  //     userId: UUIDType,
  //     questionId: UUIDType,
  //     lessonId: UUIDType,
  //   ) {
  //     return await this.db
  //       .select({
  //         id: studentQuestionAnswers.id,
  //         answer: sql<Record<string, string>>`${studentQuestionAnswers.answer}`,
  //         isCorrect: studentQuestionAnswers.isCorrect,
  //       })
  //       .from(studentQuestionAnswers)
  //       .where(
  //         and(
  //           eq(studentQuestionAnswers.lessonId, lessonId),
  //           eq(studentQuestionAnswers.questionId, questionId),
  //           eq(studentQuestionAnswers.studentId, userId),
  //         ),
  //       )
  //       .limit(1);
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

  //   async getQuizQuestionsAnswers(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     userId: UUIDType,
  //     onlyCorrect = false,
  //   ) {
  //     const conditions = [
  //       eq(studentQuestionAnswers.courseId, courseId),
  //       eq(studentQuestionAnswers.lessonId, lessonId),
  //       eq(studentQuestionAnswers.studentId, userId),
  //     ];

  //     if (onlyCorrect) conditions.push(eq(studentQuestionAnswers.isCorrect, true));

  //     return this.db
  //       .select({
  //         questionId: studentQuestionAnswers.questionId,
  //         isCorrect: studentQuestionAnswers.isCorrect,
  //       })
  //       .from(studentQuestionAnswers)
  //       .where(and(...conditions))
  //       .orderBy(studentQuestionAnswers.questionId);
  //   }

  //   async removeQuestionsAnswer(
  //     courseId: UUIDType,
  //     lessonId: UUIDType,
  //     questionIds: { questionId: string }[],
  //     userId: UUIDType,
  //     trx?: PostgresJsDatabase<typeof schema>,
  //   ) {
  //     const dbInstance = trx ?? this.db;

  //     return await dbInstance.delete(studentQuestionAnswers).where(
  //       and(
  //         eq(studentQuestionAnswers.courseId, courseId),
  //         eq(studentQuestionAnswers.lessonId, lessonId),
  //         eq(studentQuestionAnswers.studentId, userId),
  //         inArray(
  //           studentQuestionAnswers.questionId,
  //           questionIds.map((q) => q.questionId),
  //         ),
  //       ),
  //     );
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
