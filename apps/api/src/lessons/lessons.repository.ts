import { Inject, Injectable } from "@nestjs/common";
import { eq, and, sql, count, inArray, isNotNull } from "drizzle-orm";
import * as schema from "src/storage/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DatabasePg, UUIDType } from "src/common";
import {
  lessons,
  studentCourses,
  courseLessons,
  studentLessonsProgress,
  studentCompletedLessonItems,
  lessonItems,
  studentQuestionAnswers,
  questions,
  textBlocks,
  files,
  questionAnswerOptions,
} from "src/storage/schema";

@Injectable()
export class LessonsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLessons() {
    return await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        state: lessons.state,
        archived: lessons.archived,
        itemsCount: sql<number>`CAST(COUNT(DISTINCT ${lessonItems.id}) AS INTEGER)`,
      })
      .from(lessons)
      .leftJoin(lessonItems, eq(lessonItems.lessonId, lessons.id))
      .groupBy(lessons.id);
  }

  async getLessonForUser(lessonId: UUIDType, userId: UUIDType) {
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
      })
      .from(lessons)
      .leftJoin(
        studentLessonsProgress,
        and(
          eq(studentLessonsProgress.lessonId, lessonId),
          eq(studentLessonsProgress.studentId, userId),
        ),
      )
      .where(
        and(
          eq(lessons.id, lessonId),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
        ),
      );

    return lesson;
  }

  async getLessonById(lessonId: UUIDType) {
    const [lesson] = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        state: lessons.state,
        archived: lessons.archived,
      })
      .from(lessons)
      .where(eq(lessons.id, lessonId));

    return lesson;
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
          eq(questions.state, "published"),
        ),
      )
      .leftJoin(
        textBlocks,
        and(
          eq(lessonItems.lessonItemId, textBlocks.id),
          eq(lessonItems.lessonItemType, "text_block"),
          eq(textBlocks.state, "published"),
        ),
      )
      .leftJoin(
        files,
        and(
          eq(lessonItems.lessonItemId, files.id),
          eq(lessonItems.lessonItemType, "file"),
          eq(files.state, "published"),
        ),
      )
      .where(eq(lessonItems.lessonId, lessonId))
      .orderBy(lessonItems.displayOrder);
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
            WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
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
          eq(questions.state, "published"),
        ),
      )
      .leftJoin(
        studentQuestionAnswers,
        and(
          eq(studentQuestionAnswers.questionId, questions.id),
          eq(studentQuestionAnswers.studentId, studentId),
        ),
      )
      .where(eq(lessonItems.lessonId, lessonId))
      .orderBy(lessonItems.displayOrder);
  }

  async getQuestionAnswers(
    questionId: UUIDType,
    userId: UUIDType,
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
            WHEN ${studentQuestionAnswers.id} IS NULL THEN null
            WHEN EXISTS (
                SELECT 1
                FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
                WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(${questionAnswerOptions.optionText})
              )
            THEN true
            ELSE false
          END
          `,
        isCorrect: sql<boolean | null>`
          CASE
            WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
              ${questionAnswerOptions.isCorrect}
            ELSE null
          END
        `,
      })
      .from(questionAnswerOptions)
      .leftJoin(
        studentQuestionAnswers,
        and(
          eq(
            studentQuestionAnswers.questionId,
            questionAnswerOptions.questionId,
          ),
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
      );
  }

  async checkLessonAssignment(lessonId: UUIDType, userId: UUIDType) {
    return this.db
      .select({
        id: lessons.id,
        studentCourseId: studentCourses.id,
      })
      .from(lessons)
      .leftJoin(courseLessons, eq(courseLessons.id, lessons.id))
      .leftJoin(
        studentCourses,
        and(
          eq(studentCourses.courseId, courseLessons.id),
          eq(studentCourses.studentId, userId),
        ),
      )
      .where(
        and(
          eq(lessons.archived, false),
          eq(lessons.id, lessonId),
          eq(lessons.state, "published"),
        ),
      );
  }

  async completedLessonItem(lessonId: UUIDType) {
    return await this.db
      .selectDistinct({
        lessonItemId: studentCompletedLessonItems.lessonItemId,
      })
      .from(studentCompletedLessonItems)
      .where(eq(studentCompletedLessonItems.lessonId, lessonId));
  }

  async lessonProgress(lessonId: UUIDType, userId: UUIDType) {
    const [lessonProgress] = await this.db
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
        ),
      );

    return lessonProgress;
  }

  async lessonItemCount(lessonId: UUIDType) {
    const [lessonItemCount] = await this.db
      .select({ count: count(lessonItems.id) })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId));

    return lessonItemCount;
  }

  async completedLessonItemsCount(lessonId: UUIDType) {
    const [completedLessonItemsCount] = await this.db
      .selectDistinct({
        count: count(studentCompletedLessonItems.id),
      })
      .from(studentCompletedLessonItems)
      .where(eq(studentCompletedLessonItems.lessonId, lessonId));

    return completedLessonItemsCount;
  }

  async completeQuiz(lessonId: UUIDType, userId: UUIDType) {
    return await this.db
      .insert(studentLessonsProgress)
      .values({
        studentId: userId,
        lessonId: lessonId,
        quizCompleted: true,
      })
      .onConflictDoUpdate({
        target: [
          studentLessonsProgress.studentId,
          studentLessonsProgress.lessonId,
        ],
        set: {
          quizCompleted: true,
        },
      })
      .returning();
  }

  async getQuestionsIdsByLessonId(
    lessonId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    const questionIds = await dbInstance
      .select({
        questionId: studentQuestionAnswers.questionId,
      })
      .from(studentQuestionAnswers)
      .leftJoin(
        lessonItems,
        eq(studentQuestionAnswers.questionId, lessonItems.lessonItemId),
      )
      .where(eq(lessonItems.lessonId, lessonId));

    return questionIds;
  }

  async removeQuestionsAnswer(
    questionIds: { questionId: string }[],
    userId: UUIDType,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(studentQuestionAnswers).where(
      and(
        eq(studentQuestionAnswers.studentId, userId),
        inArray(
          studentQuestionAnswers.questionId,
          questionIds.map((q) => q.questionId),
        ),
      ),
    );
  }

  async setCorrectAnswerForStudentAnswer(
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
        ),
      );
  }

  async retireQuizProgress(
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
        ),
      );
  }

  async removeStudentCompletedLessonItems(
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
        ),
      );
  }

  async removeCourseLesson(courseId: string, lessonId: string) {
    return await this.db
      .delete(courseLessons)
      .where(
        and(
          eq(courseLessons.courseId, courseId),
          eq(courseLessons.lessonId, lessonId),
        ),
      )
      .returning();
  }

  async updateDisplayOrderLessonsInCourse(
    courseId: UUIDType,
    lessonId: UUIDType,
  ) {
    await this.db.execute(sql`
      UPDATE ${courseLessons}
      SET display_order = display_order - 1
      WHERE course_id = ${courseId}
        AND display_order > (
          SELECT display_order
          FROM ${courseLessons}
          WHERE course_id = ${courseId}
            AND lesson_id = ${lessonId}
        )
    `);
  }

  async getMaxOrderLessonsInCourse(courseId: UUIDType) {
    const [maxOrderResult] = await this.db
      .select({ maxOrder: sql<number>`MAX(${courseLessons.displayOrder})` })
      .from(courseLessons)
      .where(eq(courseLessons.courseId, courseId));

    return maxOrderResult?.maxOrder ?? 0;
  }

  async assignLessonToCourse(
    courseId: UUIDType,
    lessonId: UUIDType,
    displayOrder: number,
  ) {
    return await this.db.insert(courseLessons).values({
      courseId,
      lessonId,
      displayOrder,
    });
  }

  async getAvailableLessons() {
    return await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        itemsCount: sql<number>`
        (SELECT COUNT(*)
        FROM ${lessonItems}
        WHERE ${lessonItems.lessonId} = ${lessons.id} AND ${lessonItems.lessonItemType} != 'text_block')::INTEGER`,
      })
      .from(lessons)
      .where(
        and(
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      );
  }
}
