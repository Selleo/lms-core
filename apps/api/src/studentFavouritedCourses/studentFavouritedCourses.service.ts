import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { courses, studentFavouritedCourses } from "src/storage/schema";
import { Status } from "src/storage/schema/utils";

@Injectable()
export class StudentFavouritedCoursesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async createFavouritedCourseForUser(courseId: string, userId: string) {
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
      .from(studentFavouritedCourses)
      .where(
        and(
          eq(studentFavouritedCourses.courseId, courseId),
          eq(studentFavouritedCourses.studentId, userId),
        ),
      );
    if (existingRecord) {
      throw new ConflictException("Favourite course already exists");
    }

    await this.db
      .insert(studentFavouritedCourses)
      .values({ courseId: courseId, studentId: userId })
      .returning();
  }

  async deleteFavouritedCourseForUser(id: string, userId: string) {
    const [deletedFavouritedCourse] = await this.db
      .delete(studentFavouritedCourses)
      .where(
        and(
          eq(studentFavouritedCourses.id, id),
          eq(studentFavouritedCourses.studentId, userId),
        ),
      )
      .returning();

    if (!deletedFavouritedCourse) {
      throw new NotFoundException("Favourite course not found");
    }
  }
}
