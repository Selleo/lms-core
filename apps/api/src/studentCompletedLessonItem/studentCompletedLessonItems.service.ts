import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { lessonItems, studentCompletedLessonItems } from "src/storage/schema";

@Injectable()
export class StudentCompletedLessonItemsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async markLessonItemAsCompleted(
    id: string,
    lessonId: string,
    studentId: string,
  ) {
    const [lessonItem] = await this.db
      .select()
      .from(lessonItems)
      .where(
        and(
          eq(lessonItems.lessonItemId, id),
          eq(lessonItems.lessonId, lessonId),
        ),
      );

    if (!lessonItem) {
      throw new NotFoundException(`Lesson item with id ${id} not found`);
    }

    const [existingRecord] = await this.db
      .select()
      .from(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.lessonItemId, lessonItem.id),
          eq(studentCompletedLessonItems.studentId, studentId),
        ),
      );
    if (existingRecord) return;

    await this.db
      .insert(studentCompletedLessonItems)
      .values({ studentId, lessonItemId: lessonItem.id });
  }
}
