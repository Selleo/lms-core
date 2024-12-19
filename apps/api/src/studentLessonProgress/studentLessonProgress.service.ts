import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { LESSON_ITEM_TYPE } from "src/chapter/chapter.type";
import { DatabasePg } from "src/common";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import {
  chapters,
  lessons,
  studentChapterProgress,
  studentCourses,
  studentLessonProgress,
} from "src/storage/schema";
import { PROGRESS_STATUSES } from "src/utils/types/progress.type";

import type { UUIDType } from "src/common";

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
        courseId: chapters.courseId,
      })
      .from(lessons)
      .leftJoin(chapters, eq(chapters.id, lessons.chapterId))
      .where(and(eq(lessons.id, id)));

    if (!lesson || lesson.chapterId === null || lesson.courseId === null) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    if (lesson.type === "text_block") {
      throw new ConflictException("Text block is not completable");
    }

    const [existingRecord] = await this.db
      .select()
      .from(studentLessonProgress)
      .where(
        and(
          eq(studentLessonProgress.lessonId, lesson.id),
          eq(studentLessonProgress.studentId, studentId),
        ),
      );

    if (existingRecord) return;

    await this.db.insert(studentLessonProgress).values({ studentId, lessonId: lesson.id });

    await this.checkCourseIsCompletedForUser(lesson.courseId, studentId);
  }

  private async checkCourseIsCompletedForUser(courseId: UUIDType, studentId: UUIDType) {
    const courseCompleted = await this.getCourseCompletionStatus(courseId);
    const courseFinishedChapterCount = await this.getCourseFinishedChapterCount(
      courseId,
      studentId,
    );

    if (courseCompleted.courseCompleted) {
      await this.updateStudentCourseStats(
        studentId,
        courseId,
        PROGRESS_STATUSES.COMPLETED,
        courseFinishedChapterCount,
      );

      return await this.statisticsRepository.updateCompletedAsFreemiumCoursesStats(courseId);
    }

    if (courseCompleted.state !== PROGRESS_STATUSES.IN_PROGRESS) {
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

  // TODO: refactor this to use correct new names
  private async getCourseCompletionStatus(courseId: UUIDType) {
    const [courseCompleted] = await this.db.execute(sql`
      WITH lesson_count AS (
        SELECT
          course_lessons.lesson_id AS lesson_id,
          COUNT(lesson_items.id) AS lesson_count
        FROM
          course_lessons
        LEFT JOIN lesson_items ON course_lessons.lesson_id = lesson_items.lesson_id
        WHERE
          course_lessons.course_id = ${courseId}
          AND lesson_items.lesson_item_type != ${LESSON_ITEM_TYPE.text_block.key}
        GROUP BY
          course_lessons.lesson_id
      ),
      completed_lesson_count AS (
        SELECT
          course_lessons.lesson_id AS lesson_id,
          COUNT(student_completed_lesson_items.id) AS completed_lesson_count
        FROM
          course_lessons
        LEFT JOIN student_completed_lesson_items ON course_lessons.lesson_id = student_completed_lesson_items.lesson_id
        WHERE
          course_lessons.course_id = ${courseId}
        GROUP BY
          course_lessons.lesson_id
      ),
      lesson_completion_status AS (
        SELECT
          lc.lesson_id,
          CASE
            WHEN lc.lesson_count = clc.completed_lesson_count THEN 1
            ELSE 0
          END AS is_lesson_completed
        FROM
          lesson_count lc
        JOIN completed_lesson_count clc ON lc.lesson_id = clc.lesson_id
      ),
      course_completion_status AS (
        SELECT
          CASE
            WHEN COUNT(*) = SUM(is_lesson_completed) THEN true
            ELSE false
          END AS is_course_completed
        FROM
          lesson_completion_status
      )
      SELECT is_course_completed:: BOOLEAN AS "courseCompleted", student_courses.state as "state"
      FROM course_completion_status
      LEFT JOIN student_courses ON student_courses.course_id = ${courseId}
    `);

    return courseCompleted;
  }

  private async updateStudentCourseStats(
    studentId: UUIDType,
    courseId: UUIDType,
    progress: string,
    finishedChapterCount: number,
  ) {
    return await this.db
      .update(studentCourses)
      .set({ progress, completedAt: sql`now()`, finishedChapterCount })
      .where(and(eq(studentCourses.studentId, studentId), eq(studentCourses.courseId, courseId)));
  }
}
