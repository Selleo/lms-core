import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { studentCompletedLessonItems } from "src/storage/schema";

@Injectable()
export class StudentCompletedLessonItemsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async markLessonItemAsCompleted(id: string, studentId: string) {
    const [existingRecord] = await this.db
      .select()
      .from(studentCompletedLessonItems)
      .where(
        and(
          eq(studentCompletedLessonItems.lessonItemId, id),
          eq(studentCompletedLessonItems.studentId, studentId),
        ),
      );

    if (existingRecord) return;

    await this.db
      .insert(studentCompletedLessonItems)
      .values({ studentId, lessonItemId: id });
  }
}
