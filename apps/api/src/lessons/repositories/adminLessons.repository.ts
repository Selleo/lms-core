import { Inject, Injectable } from "@nestjs/common";
import { eq, and, sql, isNotNull, count } from "drizzle-orm";
import { DatabasePg, UUIDType } from "src/common";
import {
  lessons,
  courseLessons,
  lessonItems,
  files,
  questions,
  textBlocks,
  questionAnswerOptions,
} from "src/storage/schema";
import { CreateLessonBody, UpdateLessonBody } from "../schemas/lesson.schema";

@Injectable()
export class AdminLessonsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLessons(conditions: any[], sortOrder: any) {
    return await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        state: lessons.state,
        archived: lessons.archived,
        itemsCount: sql<number>`CAST(COUNT(DISTINCT ${lessonItems.id}) AS INTEGER)`,
        createdAt: lessons.createdAt,
      })
      .from(lessons)
      .leftJoin(lessonItems, eq(lessonItems.lessonId, lessons.id))
      .where(and(...conditions))
      .groupBy(lessons.id)
      .orderBy(sortOrder);
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

  async getMaxOrderLessonsInCourse(courseId: UUIDType) {
    const [maxOrderResult] = await this.db
      .select({ maxOrder: sql<number>`MAX(${courseLessons.displayOrder})` })
      .from(courseLessons)
      .where(eq(courseLessons.courseId, courseId));

    return maxOrderResult?.maxOrder ?? 0;
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

  async getQuestionAnswers(questionId: UUIDType) {
    return await this.db
      .select({
        id: questionAnswerOptions.id,
        optionText: questionAnswerOptions.optionText,
        position: questionAnswerOptions.position,
      })
      .from(questionAnswerOptions)
      .where(eq(questionAnswerOptions.questionId, questionId));
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

  async createLesson(body: CreateLessonBody, authorId: string) {
    return await this.db
      .insert(lessons)
      .values({ ...body, authorId })
      .returning();
  }

  async updateLesson(id: string, body: UpdateLessonBody) {
    return await this.db
      .update(lessons)
      .set(body)
      .where(eq(lessons.id, id))
      .returning();
  }

  async getLessonsCount(conditions: any[]) {
    return await this.db
      .select({ totalItems: count() })
      .from(lessons)
      .where(and(...conditions));
  }
}
