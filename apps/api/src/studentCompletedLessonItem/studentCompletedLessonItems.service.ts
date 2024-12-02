import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LESSON_ITEM_TYPE } from "src/lessons/lesson.type";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import {
  lessonItems,
  studentCompletedLessonItems,
  studentCourses,
  studentLessonsProgress,
} from "src/storage/schema";

import { studentCoursesStates } from "./schemas/studentCompletedLesson.schema";

import type { UUIDType } from "src/common";

@Injectable()
export class StudentCompletedLessonItemsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async markLessonItemAsCompleted(
    id: UUIDType,
    courseId: UUIDType,
    lessonId: UUIDType,
    studentId: UUIDType,
  ) {
    const [lessonItem] = await this.db
      .select()
      .from(lessonItems)
      .where(and(eq(lessonItems.id, id), eq(lessonItems.lessonId, lessonId)));

    if (!lessonItem) {
      throw new NotFoundException(`Lesson item with id ${id} not found`);
    }

    if (lessonItem.lessonItemType === "text_block") {
      throw new ConflictException("Text block is not completable");
    }

    const [existingRecord] = await this.db
      .select()
      .from(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.lessonItemId, lessonItem.id),
          eq(studentCompletedLessonItems.studentId, studentId),
          eq(studentCompletedLessonItems.lessonId, lessonId),
          eq(studentCompletedLessonItems.courseId, courseId),
        ),
      );

    if (existingRecord) return;

    await this.db
      .insert(studentCompletedLessonItems)
      .values({ studentId, lessonItemId: lessonItem.id, lessonId, courseId });

    await this.checkCourseIsCompletedForUser(courseId, studentId);
  }

  private async checkCourseIsCompletedForUser(courseId: UUIDType, studentId: UUIDType) {
    const courseCompleted = await this.getCourseCompletionStatus(courseId);
    const courseFinishedLessonsCount = await this.getCourseFinishedLessonsCount(
      courseId,
      studentId,
    );

    if (courseCompleted.courseCompleted) {
      await this.updateStudentCourseStats(
        studentId,
        courseId,
        studentCoursesStates.completed,
        courseFinishedLessonsCount,
      );

      return await this.statisticsRepository.updateCompletedAsFreemiumCoursesStats(courseId);
    }

    if (courseCompleted.state !== studentCoursesStates.in_progress) {
      return await this.updateStudentCourseStats(
        studentId,
        courseId,
        studentCoursesStates.in_progress,
        courseFinishedLessonsCount,
      );
    }
  }

  private async getCourseFinishedLessonsCount(courseId: UUIDType, studentId: UUIDType) {
    const [finishedLessonsCount] = await this.db
      .select({
        count: sql<number>`COUNT(DISTINCT ${studentLessonsProgress.lessonId})`,
      })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, studentId),
          eq(studentLessonsProgress.courseId, courseId),
          isNotNull(studentLessonsProgress.completedAt),
        ),
      );

    return finishedLessonsCount.count;
  }

  private async getCourseCompletionStatus(courseId: UUIDType) {
    const [courseCompleted] = await this.db.execute(sql`
      WITH lesson_items_count AS (
        SELECT
          course_lessons.lesson_id AS lesson_id,
          COUNT(lesson_items.id) AS lesson_items_count
        FROM
          course_lessons
        LEFT JOIN lesson_items ON course_lessons.lesson_id = lesson_items.lesson_id
        WHERE
          course_lessons.course_id = ${courseId}
          AND lesson_items.lesson_item_type != ${LESSON_ITEM_TYPE.text_block.key}
        GROUP BY
          course_lessons.lesson_id
      ),
      completed_lesson_items_count AS (
        SELECT
          course_lessons.lesson_id AS lesson_id,
          COUNT(student_completed_lesson_items.id) AS completed_lesson_items_count
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
          lic.lesson_id,
          CASE
            WHEN lic.lesson_items_count = clic.completed_lesson_items_count THEN 1
            ELSE 0
          END AS is_lesson_completed
        FROM
          lesson_items_count lic
        JOIN completed_lesson_items_count clic ON lic.lesson_id = clic.lesson_id
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
    state: string,
    completedLessonsCount: number,
  ) {
    return await this.db
      .update(studentCourses)
      .set({ state, completedAt: sql`now()`, finishedLessonsCount: completedLessonsCount })
      .where(and(eq(studentCourses.studentId, studentId), eq(studentCourses.courseId, courseId)));
  }
}
