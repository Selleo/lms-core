import { and, between, count, eq, like, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { CoursesQuery } from "./api/courses.types";
import { DatabasePg, Pagination } from "src/common";
import { AllCoursesResponse } from "./schemas/course.schema";
import { CourseSortField, CourseSortFields } from "./schemas/courseQuery";
import { getSortOptions } from "./helpers";
import {
  categories,
  courseLessons,
  courses,
  studentCourses,
  users,
} from "../storage/schema";

@Injectable()
export class CoursesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getAllCourses(
    query: CoursesQuery,
  ): Promise<{ data: AllCoursesResponse; pagination: Pagination }> {
    const {
      sort = CourseSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
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
      const conditions = [eq(courses.state, "published")];

      if (filters.title) {
        conditions.push(
          like(categories.title, `%${filters.title.toLowerCase()}%`),
        );
      }
      if (filters.category) {
        conditions.push(like(categories.title, `%${filters.category}%`));
      }
      if (filters.author) {
        const authorNameConcat = `${users.firstName} || ' ' || ${users.lastName}`;
        conditions.push(sql`${authorNameConcat} LIKE ${`%${filters.author}%`}`);
      }
      if (filters.creationDateRange) {
        const [startDate, endDate] = filters.creationDateRange;
        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();

        conditions.push(between(courses.createdAt, start, end));
      }

      const queryDB = tx
        .select(selectedColumns)
        .from(courses)
        .leftJoin(users, eq(courses.authorId, users.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          users.firstName,
          users.lastName,
          categories.title,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField)));
      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [totalItems] = await tx
        .select({ count: count() })
        .from(courses)
        .leftJoin(users, eq(courses.authorId, users.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
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

  async getCoursesForUser(
    query: CoursesQuery,
    userId: string,
  ): Promise<{ data: AllCoursesResponse; pagination: Pagination }> {
    const {
      sort = CourseSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
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
      const conditions = [
        eq(courses.state, "published"),
        eq(studentCourses.studentId, userId),
      ];

      if (filters.title) {
        conditions.push(
          like(categories.title, `%${filters.title.toLowerCase()}%`),
        );
      }
      if (filters.category) {
        conditions.push(like(categories.title, `%${filters.category}%`));
      }
      if (filters.author) {
        const authorNameConcat = `${users.firstName} || ' ' || ${users.lastName}`;
        conditions.push(sql`${authorNameConcat} LIKE ${`%${filters.author}%`}`);
      }
      if (filters.creationDateRange) {
        const [startDate, endDate] = filters.creationDateRange;
        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();

        conditions.push(between(courses.createdAt, start, end));
      }

      const queryDB = tx
        .select(selectedColumns)
        .from(studentCourses)
        .innerJoin(courses, eq(studentCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          users.firstName,
          users.lastName,
          categories.title,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField)));
      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [totalItems] = await tx
        .select({ count: count() })
        .from(courses)
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
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
