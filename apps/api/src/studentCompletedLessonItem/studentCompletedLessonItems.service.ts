import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { lessonItems, studentCompletedLessonItems } from "src/storage/schema";

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
  }
}
