import { Inject, Injectable } from "@nestjs/common";
import { DatabasePg } from "src/common";
import { studentCompletedLessonItems } from "src/storage/schema";

@Injectable()
export class StudentCompletedLessonItemsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async markLessonItemAsCompleted(id: string, studentId: string) {
    await this.db
      .insert(studentCompletedLessonItems)
      .values({ studentId, lessonItemId: id });
  }
}
