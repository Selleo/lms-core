import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, count, eq, sql } from "drizzle-orm";
import { DatabasePg, Pagination } from "src/common";
import { DEFAULT_PAGE_SIZE, addPagination } from "src/common/pagination";
import { CoursesQuery } from "src/courses/api/courses.types";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import {
  CourseSortField,
  CourseSortFields,
} from "src/courses/schemas/courseQuery";
import {
  categories,
  courseLessons,
  courses,
  studentCourses,
  studentFavouritedCourses,
  users,
} from "src/storage/schema";
import { Status } from "src/storage/schema/utils";
import { AllCoursesResponse } from "./schemas/course.schema";

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

  async getCoursesForStudents(
    query: CoursesQuery,
    userId: string,
  ): Promise<{ data: AllCoursesResponse; pagination: Pagination }> {
    const {
      sort = CourseSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);

    const selectedColumns = {
      id: courses.id,
      creationDate: courses.createdAt,
      title: courses.title,
      imageUrl: courses.imageUrl,
      author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
      category: categories.title,
      courseLessonCount: sql<number>`(SELECT COUNT(*) FROM ${courseLessons} WHERE ${courseLessons.courseId} = ${courses.id})::INTEGER`,
      enrolledParticipantCount: count(studentCourses.courseId),
    };

    return this.db.transaction(async (tx) => {
      const queryDB = tx
        .select(selectedColumns)
        .from(studentFavouritedCourses)
        .innerJoin(courses, eq(studentFavouritedCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(eq(studentFavouritedCourses.studentId, userId)))
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        )
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          users.firstName,
          users.lastName,
          categories.title,
        );

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [totalItems] = await tx
        .select({ count: count() })
        .from(studentFavouritedCourses)
        .innerJoin(courses, eq(studentFavouritedCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(eq(studentFavouritedCourses.studentId, userId)))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          users.firstName,
          users.lastName,
          categories.title,
        );

      return {
        data: data,
        pagination: {
          totalItems: totalItems?.count || 0,
          page,
          perPage,
        },
      };
    });
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

  private getColumnToSortBy(sort: CourseSortField) {
    switch (sort) {
      case CourseSortFields.author:
        return sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`;
      case CourseSortFields.category:
        return categories.title;
      case CourseSortFields.creationDate:
        return courses.createdAt;
      case CourseSortFields.lessonsCount:
        return count(studentCourses.courseId);
      case CourseSortFields.enrolledParticipantsCount:
        return count(studentCourses.courseId);
      default:
        return courses.title;
    }
  }
}
