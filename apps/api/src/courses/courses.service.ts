import { and, between, count, eq, isNotNull, like, sql } from "drizzle-orm";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { CoursesQuery } from "./api/courses.types";
import { DatabasePg, Pagination } from "src/common";
import { AllCoursesResponse } from "./schemas/course.schema";
import {
  CoursesFilterSchema,
  CourseSortField,
  CourseSortFields,
} from "./schemas/courseQuery";
import {
  categories,
  courseLessons,
  courses,
  lessons,
  studentCourses,
  users,
} from "../storage/schema";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import { AllLessonsResponse } from "src/lessons/schemas/lesson.schema";

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
    const conditions = this.getFiltersConditions(filters);

    return this.db.transaction(async (tx) => {
      const queryDB = tx
        .select(this.getSelectFiled())
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
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

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

    return this.db.transaction(async (tx) => {
      const conditions = [eq(studentCourses.studentId, userId)];
      conditions.push(...this.getFiltersConditions(filters));

      const queryDB = tx
        .select(this.getSelectFiled())
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
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

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

  async getCourse(id: string, userId: string) {
    console.log("test test test");
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: courses.imageUrl,
        category: categories.title,
        courseLessonCount: sql<number>`(SELECT COUNT(*) FROM ${courseLessons} WHERE ${courseLessons.courseId} = ${courses.id})::INTEGER`,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
        state: studentCourses.state,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .innerJoin(users, eq(courses.authorId, users.id))
      .leftJoin(
        studentCourses,
        and(
          eq(courses.id, studentCourses.courseId),
          eq(studentCourses.studentId, userId),
        ),
      )
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");
    if (!course.imageUrl) throw new ConflictException("Course has no image");

    if (!course.enrolled)
      return {
        ...course,
        lessons: null,
      };

    const courseLessonList: AllLessonsResponse = (await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: lessons.description,
        imageUrl: lessons.imageUrl,
      })
      .from(courseLessons)
      .leftJoin(lessons, eq(courseLessons.lessonId, lessons.id))
      .where(
        and(
          eq(courseLessons.courseId, id),
          eq(lessons.archived, false),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      )) as AllLessonsResponse;

    console.log(courseLessonList);

    if (!courseLessonList) throw new NotFoundException("Lessons not found");

    return {
      ...course,
      lessons: courseLessonList,
    };
  }

  private getSelectFiled() {
    return {
      id: courses.id,
      creationDate: courses.createdAt,
      title: courses.title,
      imageUrl: courses.imageUrl,
      author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
      category: categories.title,
      courseLessonCount: sql<number>`(SELECT COUNT(*) FROM ${courseLessons} WHERE ${courseLessons.courseId} = ${courses.id})::INTEGER`,
      enrolledParticipantCount: count(studentCourses.courseId),
    };
  }

  private getFiltersConditions(filters: CoursesFilterSchema) {
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
    return conditions;
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
