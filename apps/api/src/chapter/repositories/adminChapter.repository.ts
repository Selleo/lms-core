import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gte, lte, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, lessons, questionAnswerOptions, questions } from "src/storage/schema";

import type { UpdateChapterBody } from "../schemas/chapter.schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { AdminLessonWithContentSchema, QuestionSchema } from "src/lesson/lesson.schema";
import type * as schema from "src/storage/schema";

@Injectable()
export class AdminChapterRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getChapterById(chapterId: UUIDType) {
    return await this.db.select().from(chapters).where(eq(chapters.id, chapterId));
  }

  async changeChapterDisplayOrder(
    courseId: UUIDType,
    chapterId: UUIDType,
    oldDisplayOrder: number,
    newDisplayOrder: number,
  ) {
    await this.db.transaction(async (trx) => {
      await trx
        .update(chapters)
        .set({
          displayOrder: sql`CASE
            WHEN ${eq(chapters.id, chapterId)}
              THEN ${newDisplayOrder}
            WHEN ${newDisplayOrder < oldDisplayOrder}
              AND ${gte(chapters.displayOrder, newDisplayOrder)}
              AND ${lte(chapters.displayOrder, oldDisplayOrder)}
              THEN ${chapters.displayOrder} + 1
            WHEN ${newDisplayOrder > oldDisplayOrder}
              AND ${lte(chapters.displayOrder, newDisplayOrder)}
              AND ${gte(chapters.displayOrder, oldDisplayOrder)}
              THEN ${chapters.displayOrder} - 1
            ELSE ${chapters.displayOrder}
          END
          `,
        })
        .where(eq(chapters.courseId, courseId));
    });
  }

  // async getLessons(conditions: any[], sortOrder: any) {
  //   return await this.db
  //     .select({
  //       id: lessons.id,
  //       title: lessons.title,
  //       description: sql<string>`COALESCE(${lessons.description}, '')`,
  //       imageUrl: sql<string>`COALESCE(${lessons.imageUrl}, '')`,
  //       state: lessons.state,
  //       archived: lessons.archived,
  //       itemsCount: sql<number>`CAST(COUNT(DISTINCT ${lessonItems.id}) AS INTEGER)`,
  //       createdAt: lessons.createdAt,
  //     })
  //     .from(lessons)
  //     .leftJoin(lessonItems, eq(lessonItems.lessonId, lessons.id))
  //     .where(and(...conditions))
  //     .groupBy(lessons.id)
  //     .orderBy(sortOrder);
  // }

  // async getLessonById(lessonId: UUIDType) {
  //   const [lesson] = await this.db
  //     .select({
  //       id: lessons.id,
  //       title: lessons.title,
  //       description: sql<string>`COALESCE(${lessons.description}, '')`,
  //       imageUrl: sql<string>`COALESCE(${lessons.imageUrl}, '')`,
  //       state: lessons.state,
  //       archived: lessons.archived,
  //       type: lessons.type,
  //     })
  //     .from(lessons)
  //     .where(eq(lessons.id, lessonId));

  //   return lesson;
  // }

  // async getAvailableLessons(courseId: UUIDType) {
  //   return await this.db
  //     .select({
  //       id: lessons.id,
  //       title: lessons.title,
  //       description: sql<string>`${lessons.description}`,
  //       imageUrl: sql<string>`${lessons.imageUrl}`,
  //       itemsCount: sql<number>`
  //       (SELECT COUNT(*)
  //       FROM ${lessonItems}
  //       WHERE ${lessonItems.lessonId} = ${lessons.id} AND ${lessonItems.lessonItemType} != 'text_block')::INTEGER`,
  //       isFree: sql<boolean>`COALESCE(${courseLessons.isFree}, false)`,
  //     })
  //     .from(lessons)
  //     .leftJoin(
  //       courseLessons,
  //       and(eq(courseLessons.lessonId, lessons.id), eq(courseLessons.courseId, courseId)),
  //     )
  //     .where(
  //       and(
  //         eq(lessons.archived, false),
  //         eq(lessons.state, "published"),
  //         isNotNull(lessons.id),
  //         isNotNull(lessons.title),
  //         isNotNull(lessons.description),
  //         isNotNull(lessons.imageUrl),
  //       ),
  //     );
  // }

  // async updateDisplayOrderLessonsInCourse(courseId: UUIDType, chapterId: UUIDType) {
  //   await this.db.execute(sql`
  //     UPDATE ${courseLessons}
  //     SET display_order = display_order - 1
  //     WHERE course_id = ${courseId}
  //       AND display_order > (
  //         SELECT display_order
  //         FROM ${courseLessons}
  //         WHERE course_id = ${courseId}
  //           AND lesson_id = ${chapterId}
  //       )
  //   `);
  // }

  async updateChapterDisplayOrder(courseId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.execute(sql`
        WITH ranked_chapters AS (
          SELECT id, row_number() OVER (ORDER BY display_order) AS new_display_order
          FROM ${chapters}
          WHERE course_id = ${courseId}
        )
        UPDATE ${chapters} cc
        SET display_order = rc.new_display_order
        FROM ranked_chapters rc
        WHERE cc.id = rc.id
          AND cc.course_id = ${courseId}
      `);
  }

  // async removeCourseLesson(courseId: string, lessonId: string) {
  //   return await this.db
  //     .delete(courseLessons)
  //     .where(and(eq(courseLessons.courseId, courseId), eq(courseLessons.lessonId, lessonId)))
  //     .returning();
  // }

  async removeChapter(chapterId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(chapters).where(eq(chapters.id, chapterId)).returning();
  }

  // async getMaxOrderLessonsInCourse(courseId: UUIDType) {
  //   const [maxOrderResult] = await this.db
  //     .select({ maxOrder: sql<number>`MAX(${courseLessons.displayOrder})` })
  //     .from(courseLessons)
  //     .where(eq(courseLessons.courseId, courseId));

  //   return maxOrderResult?.maxOrder ?? 0;
  // }

  // async getLessonItems(lessonId: UUIDType) {
  //   return await this.db
  //     .select({
  //       lessonItemType: lessonItems.lessonItemType,
  //       lessonItemId: lessonItems.id,
  //       questionData: questions,
  //       textBlockData: textBlocks,
  //       fileData: files,
  //       displayOrder: lessonItems.displayOrder,
  //     })
  //     .from(lessonItems)
  //     .leftJoin(
  //       questions,
  //       and(
  //         eq(lessonItems.lessonItemId, questions.id),
  //         eq(lessonItems.lessonItemType, LESSON_ITEM_TYPE.question.key),
  //         eq(questions.state, "published"),
  //       ),
  //     )
  //     .leftJoin(
  //       textBlocks,
  //       and(
  //         eq(lessonItems.lessonItemId, textBlocks.id),
  //         eq(lessonItems.lessonItemType, LESSON_ITEM_TYPE.text_block.key),
  //         eq(textBlocks.state, "published"),
  //       ),
  //     )
  //     .leftJoin(
  //       files,
  //       and(
  //         eq(lessonItems.lessonItemId, files.id),
  //         eq(lessonItems.lessonItemType, LESSON_ITEM_TYPE.file.key),
  //         eq(files.state, "published"),
  //       ),
  //     )
  //     .where(eq(lessonItems.lessonId, lessonId))
  //     .orderBy(lessonItems.displayOrder);
  // }

  // imageUrl: lesson.imageUrl.startsWith("https://")
  // //           ? lesson.imageUrl
  // //           : await this.fileService.getFileUrl(lesson.imageUrl),
  // //       };

  async getBetaChapterLessons(chapterId: UUIDType): Promise<AdminLessonWithContentSchema[]> {
    return await this.db
      .select({
        updatedAt: sql<string>`${lessons.updatedAt}`,
        id: lessons.id,
        title: lessons.title,
        type: lessons.type,
        description: sql<string>`${lessons.description}`,
        fileS3Key: sql<string>`${lessons.fileS3Key}`,
        fileType: sql<string>`${lessons.fileType}`,
        displayOrder: sql<number>`${lessons.displayOrder}`,
        questions: sql<QuestionSchema[]>`
        (
          SELECT ARRAY(
            SELECT json_build_object(
              'id', ${questions.id},
              'title', ${questions.title},
              'type', ${questions.type},
              'description', ${questions.description},
              'photoS3Key', ${questions.photoS3Key},
              'displayOrder', ${questions.displayOrder},
              'photoQuestionType', ${questions.photoQuestionType},
              'options', (
                SELECT ARRAY(
                  SELECT json_build_object(
                    'id', ${questionAnswerOptions.id},
                    'optionText', ${questionAnswerOptions.optionText},
                    'isCorrect', ${questionAnswerOptions.isCorrect},
                    'displayOrder', ${questionAnswerOptions.displayOrder},
                    'matchedWord', ${questionAnswerOptions.matchedWord},
                    'scaleAnswer', ${questionAnswerOptions.scaleAnswer}
                  )
                  FROM ${questionAnswerOptions} questionAnswerOptions
                  WHERE questionAnswerOptions.question_id = questions.id
                )
              )
            )
            FROM ${questions}
            WHERE ${questions.lessonId} = lessons.id
          )
        )`,
      })
      .from(lessons)
      .where(and(eq(lessons.chapterId, chapterId)))
      .orderBy(lessons.displayOrder);
  }

  async updateFreemiumStatus(chapterId: string, isFreemium: boolean) {
    return await this.db.update(chapters).set({ isFreemium }).where(eq(chapters.id, chapterId));
  }

  // async getQuestionAnswers(questionId: UUIDType) {
  //   return await this.db
  //     .select({
  //       id: questionAnswerOptions.id,
  //       optionText: questionAnswerOptions.optionText,
  //       position: questionAnswerOptions.position,
  //     })
  //     .from(questionAnswerOptions)
  //     .where(eq(questionAnswerOptions.questionId, questionId));
  // }

  // async assignLessonToCourse(courseId: UUIDType, lessonId: UUIDType, displayOrder: number) {
  //   return await this.db.insert(courseLessons).values({
  //     courseId,
  //     lessonId,
  //     displayOrder,
  //   });
  // }

  // async updateFreemiumStatus(lessonId: string, isFreemium: boolean) {
  //   const [updateFreemiumStatus] = await this.db
  //     .update(courseLessons)
  //     .set({
  //       isFree: isFreemium,
  //     })
  //     .where(eq(courseLessons.lessonId, lessonId))
  //     .returning();

  //   return updateFreemiumStatus;
  // }

  // async toggleLessonAsFree(courseId: UUIDType, lessonId: UUIDType, isFree: boolean) {
  //   return await this.db
  //     .update(courseLessons)
  //     .set({ isFree })
  //     .where(and(eq(courseLessons.lessonId, lessonId), eq(courseLessons.courseId, courseId)))
  //     .returning();
  // }

  // async createLesson(body: CreateLessonBody, authorId: string) {
  //   return await this.db
  //     .insert(lessons)
  //     .values({ ...body, authorId })
  //     .returning();
  // }

  async updateChapter(id: string, body: UpdateChapterBody) {
    return await this.db.update(chapters).set(body).where(eq(chapters.id, id)).returning();
  }

  // async getLessonsCount(conditions: any[]) {
  //   return await this.db
  //     .select({ totalItems: count() })
  //     .from(lessons)
  //     .where(and(...conditions));
  // }

  // async updateLessonItemsCount(lessonId: string, trx?: PostgresJsDatabase<typeof schema>) {
  //   const dbInstance = trx ?? this.db;

  //   return await dbInstance
  //     .update(lessons)
  //     .set({
  //       itemsCount: sql<number>`(
  //         SELECT COUNT(*)
  //         FROM ${lessonItems}
  //         WHERE ${lessonItems.lessonId} = ${lessons.id}
  //     )`,
  //     })
  //     .where(eq(lessons.id, lessonId));
  // }
}
