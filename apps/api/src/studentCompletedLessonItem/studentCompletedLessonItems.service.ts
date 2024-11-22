import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { lessonItems, studentCompletedLessonItems, studentCourses } from "src/storage/schema";

import { studentCoursesStates } from "./schemas/studentCompletedLesson.schema";

import type { UUIDType } from "src/common";

@Injectable()
export class StudentCompletedLessonItemsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

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

    if (courseCompleted.courseCompleted) {
      return this.updateStudentCourseState(studentId, courseId, studentCoursesStates.completed);
    }

    if (courseCompleted.state !== studentCoursesStates.in_progress) {
      return this.updateStudentCourseState(studentId, courseId, studentCoursesStates.in_progress);
    }
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
          AND lesson_items.lesson_item_type != 'text_block'
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

  private async updateStudentCourseState(studentId: UUIDType, courseId: UUIDType, state: string) {
    return await this.db
      .update(studentCourses)
      .set({ state })
      .where(and(eq(studentCourses.studentId, studentId), eq(studentCourses.courseId, courseId)));
  }
}
