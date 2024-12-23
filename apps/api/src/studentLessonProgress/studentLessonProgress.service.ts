import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import {
  chapters,
  courses,
  lessons,
  studentChapterProgress,
  studentCourses,
  studentLessonProgress,
} from "src/storage/schema";
import { PROGRESS_STATUSES } from "src/utils/types/progress.type";

import type { UUIDType } from "src/common";
import type { ProgressStatus } from "src/utils/types/progress.type";

@Injectable()
export class StudentLessonProgressService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async markLessonAsCompleted(id: UUIDType, studentId: UUIDType) {
    const [lesson] = await this.db
      .select({
        id: lessons.id,
        type: lessons.type,
        chapterId: chapters.id,
        chapterLessonCount: chapters.lessonCount,
        courseId: chapters.courseId,
      })
      .from(lessons)
      .leftJoin(chapters, eq(chapters.id, lessons.chapterId))
      .where(and(eq(lessons.id, id)));

    if (!lesson || !lesson.chapterId || !lesson.courseId || !lesson.chapterLessonCount) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    const [createdLessonProgress] = await this.db
      .insert(studentLessonProgress)
      .values({ studentId, lessonId: lesson.id, completedAt: sql`now()` })
      .onConflictDoNothing()
      .returning();

    if (!createdLessonProgress) return;

    await this.updateChapterProgress(lesson.chapterId, studentId, lesson.chapterLessonCount);

    await this.checkCourseIsCompletedForUser(lesson.courseId, studentId);
  }

  private async updateChapterProgress(
    chapterId: UUIDType,
    studentId: UUIDType,
    lessonCount: number,
  ) {
    const [completedLessonCount] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(studentLessonProgress)
      .where(
        and(
          eq(studentLessonProgress.chapterId, chapterId),
          eq(studentLessonProgress.studentId, studentId),
          isNotNull(studentLessonProgress.completedAt),
        ),
      );

    if (completedLessonCount.count === lessonCount) {
      return await this.db
        .update(studentChapterProgress)
        .set({
          completedLessonCount: completedLessonCount.count,
          completedAt: sql`now()`,
        })
        .where(
          and(
            eq(studentChapterProgress.chapterId, chapterId),
            eq(studentChapterProgress.studentId, studentId),
          ),
        )
        .returning();
    }

    return await this.db
      .update(studentChapterProgress)
      .set({
        completedLessonCount: completedLessonCount.count,
      })
      .where(
        and(
          eq(studentChapterProgress.chapterId, chapterId),
          eq(studentChapterProgress.studentId, studentId),
        ),
      )
      .returning();
  }

  private async checkCourseIsCompletedForUser(courseId: UUIDType, studentId: UUIDType) {
    const courseProgress = await this.getCourseCompletionStatus(courseId, studentId);
    const courseFinishedChapterCount = await this.getCourseFinishedChapterCount(
      courseId,
      studentId,
    );

    if (courseProgress.courseIsCompleted) {
      await this.updateStudentCourseStats(
        studentId,
        courseId,
        PROGRESS_STATUSES.COMPLETED,
        courseFinishedChapterCount,
      );

      return await this.statisticsRepository.updateCompletedAsFreemiumCoursesStats(courseId);
    }

    if (courseProgress.progress !== PROGRESS_STATUSES.IN_PROGRESS) {
      return await this.updateStudentCourseStats(
        studentId,
        courseId,
        PROGRESS_STATUSES.IN_PROGRESS,
        courseFinishedChapterCount,
      );
    }
  }

  private async getCourseFinishedChapterCount(courseId: UUIDType, studentId: UUIDType) {
    const [finishedLessonsCount] = await this.db
      .select({
        count: sql<number>`COUNT(DISTINCT ${studentChapterProgress.chapterId})`,
      })
      .from(studentChapterProgress)
      .where(
        and(
          eq(studentChapterProgress.studentId, studentId),
          eq(studentChapterProgress.courseId, courseId),
          isNotNull(studentChapterProgress.completedAt),
        ),
      );

    return finishedLessonsCount.count;
  }

  private async getCourseCompletionStatus(courseId: UUIDType, studentId: UUIDType) {
    const [courseCompletedStatus] = await this.db
      .select({
        courseIsCompleted: sql<boolean>`${studentCourses.finishedChapterCount} = ${courses.chapterCount}`,
        progress: sql<ProgressStatus>`${studentCourses.progress}`,
      })
      .from(studentCourses)
      .leftJoin(courses, and(eq(courses.id, studentCourses.courseId)))
      .where(and(eq(studentCourses.courseId, courseId), eq(studentCourses.studentId, studentId)));

    return {
      courseIsCompleted: courseCompletedStatus.courseIsCompleted,
      progress: courseCompletedStatus.progress,
    };
  }

  private async updateStudentCourseStats(
    studentId: UUIDType,
    courseId: UUIDType,
    progress: ProgressStatus,
    finishedChapterCount: number,
  ) {
    if (progress === PROGRESS_STATUSES.COMPLETED) {
      return await this.db
        .update(studentCourses)
        .set({ progress, completedAt: sql`now()`, finishedChapterCount })
        .where(and(eq(studentCourses.studentId, studentId), eq(studentCourses.courseId, courseId)));
    }

    return await this.db
      .update(studentCourses)
      .set({ progress, finishedChapterCount })
      .where(and(eq(studentCourses.studentId, studentId), eq(studentCourses.courseId, courseId)));
  }
}
