import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg, type UUIDType } from "src/common";

import { chapters, studentChapterProgress, studentCourses } from "src/storage/schema";

@Injectable()
export class ChapterRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getChapterForUser(id: UUIDType, userId: UUIDType) {
    const [lesson] = await this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        isFreemium: chapters.isFreemium,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.id} IS NOT NULL THEN true ELSE false END`,
        lessonCount: chapters.lessonCount,
        completedLessonCount: sql<number>`COALESCE(${studentChapterProgress.completedLessonCount}, 0)`,
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

    return lesson;
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

  async getChapterProgressForStudent(chapterId: UUIDType, userId: UUIDType) {
    const [chapterProgress] = await this.db
      .select({})
      .from(studentChapterProgress)
      .where(
        and(
          eq(studentChapterProgress.studentId, userId),
          eq(studentChapterProgress.chapterId, chapterId),
        ),
      );

    return chapterProgress;
  }
}
