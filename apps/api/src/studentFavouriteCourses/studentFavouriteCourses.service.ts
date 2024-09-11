import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { courses, studentFavouriteCourses } from "src/storage/schema";
import { Status } from "src/storage/schema/utils";

@Injectable()
export class StudentFavouriteCoursesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async createFavouriteCourseForUser(courseId: string, userId: string) {
    const [course] = await this.db
      .select()
      .from(courses)
      .where(
        and(eq(courses.id, courseId), eq(courses.state, Status.published.key)),
      );
    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const [existingRecord] = await this.db
      .select()
      .from(studentFavouriteCourses)
      .where(
        and(
          eq(studentFavouriteCourses.courseId, courseId),
          eq(studentFavouriteCourses.studentId, userId),
        ),
      );
    if (existingRecord) {
      throw new ConflictException("Favourite course already exists");
    }

    await this.db
      .insert(studentFavouriteCourses)
      .values({ courseId: courseId, studentId: userId })
      .returning();
  }

  async deleteFavouriteCourseForUser(id: string, userId: string) {
    const [deletedFavouriteCourse] = await this.db
      .delete(studentFavouriteCourses)
      .where(
        and(
          eq(studentFavouriteCourses.id, id),
          eq(studentFavouriteCourses.studentId, userId),
        ),
      )
      .returning();

    if (!deletedFavouriteCourse) {
      throw new NotFoundException("Favourite course not found");
    }
  }
}
