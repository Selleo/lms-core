import { Inject, Injectable } from "@nestjs/common";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";
import { chapters, lessons, studentChapterProgress, studentCourses } from "src/storage/schema";
import { PROGRESS_STATUS } from "src/utils/types/progress.type";

import type { ProgressStatusType } from "src/utils/types/progress.type";

@Injectable()
export class ChapterRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getChapterWithDetails(id: UUIDType, userId: UUIDType, isStudent: boolean) {
    return this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        displayOrder: chapters.displayOrder,
        lessonCount: chapters.lessonCount,
        isFree: chapters.isFreemium,
        lessons: sql<string>`
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', ${lessons.id},
                  'type', ${lessons.type},
                  'displayOrder', ${lessons.displayOrder}
                  'title', ${lessons.title},
                  'description', ${lessons.description},
                  'fileS3Key', ${lessons.fileS3Key},
                  'fileType', ${lessons.fileType},
                )
              )
              FROM ${lessons}
              WHERE ${lessons.chapterId} = ${chapters.id}
              ORDER BY ${lessons.displayOrder}
            ),
            '[]'::json
          )
        `,
      })
      .from(chapters)
      .where(and(eq(chapters.courseId, id), isNotNull(chapters.title)))
      .orderBy(chapters.displayOrder);
  }

  async checkChapterAssignment(id: UUIDType, userId: UUIDType) {
    return this.db
      .select({
        id: chapters.id,
        isFreemium: chapters.isFreemium,
        isAssigned: sql<boolean>`CASE WHEN ${studentCourses.id} IS NOT NULL THEN TRUE ELSE FALSE END`,
      })
      .from(chapters)
      .leftJoin(
        studentCourses,
        and(eq(studentCourses.courseId, chapters.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(chapters.isPublished, true), eq(chapters.id, id)));
  }

  async getChapterForUser(id: UUIDType, userId: UUIDType) {
    const [chapter] = await this.db
      .select({
        displayOrder: sql<number>`${lessons.displayOrder}`,
        id: chapters.id,
        title: chapters.title,
        isFreemium: chapters.isFreemium,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.id} IS NOT NULL THEN true ELSE false END`,
        lessonCount: chapters.lessonCount,
        completedLessonCount: sql<number>`COALESCE(${studentChapterProgress.completedLessonCount}, 0)`,
        progress: sql<ProgressStatusType>`
          CASE ${studentChapterProgress.completedAt} IS NOT NULL
            THEN ${PROGRESS_STATUS.completed}
            WHEN ${studentChapterProgress.completedAt} IS NULL AND ${studentChapterProgress.completedLessonCount} < 0
              THEN ${PROGRESS_STATUS.inProgress}
            ELSE ${PROGRESS_STATUS.notStarted}`,
      })
      .from(chapters)
      .leftJoin(
        studentChapterProgress,
        and(
          eq(studentChapterProgress.courseId, chapters.courseId),
          eq(studentChapterProgress.chapterId, chapters.id),
          eq(studentChapterProgress.studentId, userId),
        ),
      )
      .leftJoin(
        studentCourses,
        and(eq(studentCourses.courseId, chapters.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(chapters.id, id), eq(chapters.isPublished, true)));

    return chapter;
  }

  async getChapter(id: UUIDType) {
    const [chapter] = await this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        isFreemium: chapters.isFreemium,
        itemsCount: chapters.lessonCount,
      })
      .from(chapters)
      .where(and(eq(chapters.id, id), eq(chapters.isPublished, true)));

    return chapter;
  }
}
