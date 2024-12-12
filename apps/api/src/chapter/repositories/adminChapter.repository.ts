import { Inject, Injectable } from "@nestjs/common";
import { eq, and, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, lessons } from "src/storage/schema";

@Injectable()
export class AdminChapterRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

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

  // async updateChapterDisplayOrder(courseId: UUIDType, lessonId: UUIDType) {
  //   await this.db.transaction(async (trx) => {
  //     await trx.execute(sql`
  //       UPDATE ${courseLessons}
  //       SET display_order = display_order - 1
  //       WHERE course_id = ${courseId}
  //         AND display_order > (
  //           SELECT display_order
  //           FROM ${courseLessons}
  //           WHERE course_id = ${courseId}
  //             AND lesson_id = ${lessonId}
  //         )
  //     `);

  //     await trx.execute(sql`
  //       WITH ranked_lessons AS (
  //         SELECT lesson_id, row_number() OVER (ORDER BY display_order) AS new_display_order
  //         FROM ${courseLessons}
  //         WHERE course_id = ${courseId}
  //       )
  //       UPDATE ${courseLessons} cl
  //       SET display_order = rl.new_display_order
  //       FROM ranked_lessons rl
  //       WHERE cl.lesson_id = rl.lesson_id
  //         AND cl.course_id = ${courseId}
  //     `);
  //   });
  // }

  // async removeCourseLesson(courseId: string, lessonId: string) {
  //   return await this.db
  //     .delete(courseLessons)
  //     .where(and(eq(courseLessons.courseId, courseId), eq(courseLessons.lessonId, lessonId)))
  //     .returning();
  // }

  // async removeChapterAndReferences(
  //   chapterId: string,
  //   lessonItemsList: LessonItemWithContentSchema[],
  // ) {
  //   return await this.db.transaction(async (trx) => {
  //     for (const lessonItem of lessonItemsList) {
  //       const { lessonItemType } = lessonItem;
  //       switch (lessonItemType) {
  //         case LESSON_ITEM_TYPE.text_block.key:
  //           if (lessonItem.textBlockData?.id) {
  //             await trx.delete(textBlocks).where(eq(textBlocks.id, lessonItem.textBlockData.id));
  //           }
  //           break;

  //         case LESSON_ITEM_TYPE.question.key:
  //           if (lessonItem.questionData?.id) {
  //             await trx.delete(questions).where(eq(questions.id, lessonItem.questionData.id));
  //           }
  //           break;

  //         case LESSON_ITEM_TYPE.file.key:
  //           if (lessonItem.fileData?.id) {
  //             await trx.delete(files).where(eq(files.id, lessonItem.fileData.id));
  //           }
  //           break;

  //         default:
  //           throw new Error(`Unsupported lesson item type: ${lessonItemType}`);
  //       }
  //     }
  //     await trx.delete(lessonItems).where(eq(lessonItems.lessonId, chapterId));

  //     await trx.delete(courseLessons).where(eq(courseLessons.lessonId, chapterId));

  //     return await trx.delete(lessons).where(eq(lessons.id, chapterId)).returning();
  //   });
  // }

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

  async getBetaChapterLessons(chapterId: UUIDType) {
    return await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        type: lessons.type,
        description: sql<string>`${lessons.description}`,
        fileS3Key: sql<string>`${lessons.fileS3Key}`,
        fileType: sql<string>`${lessons.fileType}`,
        displayOrder: sql<number>`(${lessons.displayOrder})`,
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

  // async updateLesson(id: string, body: UpdateLessonBody) {
  //   return await this.db.update(lessons).set(body).where(eq(lessons.id, id)).returning();
  // }

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
