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

  async removeChapter(chapterId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return await dbInstance.delete(chapters).where(eq(chapters.id, chapterId)).returning();
  }

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
        isExternal: sql<boolean>`${lessons.isExternal}`,
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

  async updateChapter(id: string, body: UpdateChapterBody) {
    return await this.db.update(chapters).set(body).where(eq(chapters.id, id)).returning();
  }
}
