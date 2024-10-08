import {
  and,
  between,
  count,
  countDistinct,
  eq,
  ilike,
  isNotNull,
  isNull,
  like,
  sql,
} from "drizzle-orm";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import type { CoursesQuery } from "./api/courses.types";
import type { DatabasePg, Pagination } from "src/common";
import type { AllCoursesResponse } from "./schemas/course.schema";
import {
  type CoursesFilterSchema,
  type CourseSortField,
  CourseSortFields,
} from "./schemas/courseQuery";
import {
  categories,
  courseLessons,
  courses,
  lessonItems,
  lessons,
  studentCompletedLessonItems,
  studentCourses,
  users,
} from "../storage/schema";
import { getSortOptions } from "../common/helpers/getSortOptions";
import { S3Service } from "src/file/s3.service";
import { isEmpty } from "lodash";

@Injectable()
export class CoursesService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async getAllCourses(
    query: CoursesQuery,
    userId: string,
  ): Promise<{
    data: AllCoursesResponse;
    pagination: Pagination;
  }> {
    const {
      sort = CourseSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const conditions = this.getFiltersConditions(filters);

    return await this.db.transaction(async (tx) => {
      const queryDB = tx
        .select(this.getSelectField(userId))
        .from(courses)
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(
          studentCourses,
          and(
            eq(courses.id, studentCourses.courseId),
            eq(studentCourses.studentId, userId),
          ),
        )
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          users.firstName,
          users.lastName,
          studentCourses.studentId,
          categories.title,
        )
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;

      const [{ totalItems }] = await tx
        .select({
          totalItems: countDistinct(courses.id),
        })
        .from(courses)
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(
          and(
            ...conditions,
            eq(courses.archived, false),
            eq(courses.state, "published"),
          ),
        );

      const dataWithS3SignedUrls = await this.addS3SignedUrls(data);

      return {
        data: dataWithS3SignedUrls,
        pagination: {
          totalItems: totalItems || 0,
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
        .select(this.getSelectField(userId))
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
          courses.description,
          users.firstName,
          users.lastName,
          studentCourses.studentId,
          categories.title,
        )
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [{ totalItems }] = await tx
        .select({ totalItems: countDistinct(courses.id) })
        .from(studentCourses)
        .innerJoin(courses, eq(studentCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(
          and(
            ...conditions,
            eq(courses.state, "published"),
            eq(courses.archived, false),
          ),
        );

      const dataWithS3SignedUrls = await this.addS3SignedUrls(data);

      return {
        data: dataWithS3SignedUrls,
        pagination: {
          totalItems: totalItems || 0,
          page,
          perPage,
        },
      };
    });
  }

  async getAvailableCourses(
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
      const conditions = [
        eq(courses.state, "published"),
        eq(courses.archived, false),
        isNull(studentCourses.studentId),
      ];
      conditions.push(...this.getFiltersConditions(filters));

      const queryDB = tx
        .select(this.getSelectField(userId))
        .from(courses)
        .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          courses.description,
          users.firstName,
          users.lastName,
          studentCourses.studentId,
          categories.title,
        )
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [{ totalItems }] = await tx
        .select({ totalItems: countDistinct(courses.id) })
        .from(courses)
        .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions));

      const dataWithS3SignedUrls = await this.addS3SignedUrls(data);

      return {
        data: dataWithS3SignedUrls,
        pagination: {
          totalItems: totalItems || 0,
          page,
          perPage,
        },
      };
    });
  }

  async getCourse(id: string, userId: string) {
    const [course] = await this.db
      .select({
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
        id: courses.id,
        title: courses.title,
        imageUrl: courses.imageUrl,
        category: categories.title,
        description: sql<string>`${courses.description}`,
        courseLessonCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${courseLessons}
          JOIN ${lessons} ON ${courseLessons.lessonId} = ${lessons.id}
          WHERE ${courseLessons.courseId} = ${courses.id} AND ${lessons.state} = 'published' AND ${lessons.archived} = false)::INTEGER`,
        completedLessonCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${courseLessons}
          JOIN ${lessons} ON ${courseLessons.lessonId} = ${lessons.id}
          WHERE ${courseLessons.courseId} = ${courses.id}
            AND ${lessons.state} = 'published'
            AND ${lessons.archived} = false
            AND (
              SELECT COUNT(*)
              FROM ${lessonItems}
              WHERE ${lessonItems.lessonId} = ${lessons.id}
                AND ${lessonItems.lessonItemType} != 'text_block'
            ) = (
              SELECT COUNT(*)
              FROM ${studentCompletedLessonItems}
              WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
                AND ${studentCompletedLessonItems.studentId} = ${userId}
            )
          )::INTEGER`,
        state: studentCourses.state,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
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

    const courseLessonList = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        itemsCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${lessonItems}
          WHERE ${lessonItems.lessonId} = ${lessons.id} AND ${lessonItems.lessonItemType} != 'text_block')::INTEGER`,
        itemsCompletedCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${studentCompletedLessonItems}
          WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
          AND ${studentCompletedLessonItems.studentId} = ${userId})::INTEGER`,
      })
      .from(courseLessons)
      .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
      .where(
        and(
          eq(courseLessons.courseId, id),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      );

    if (isEmpty(courseLessonList))
      throw new NotFoundException("Lessons not found");

    const imageUrl = (course.imageUrl as string).startsWith("https://")
      ? course.imageUrl
      : await this.s3Service.getSignedUrl(course.imageUrl);

    return {
      ...course,
      imageUrl,
      lessons: courseLessonList,
    };
  }

  async enrollCourse(id: string, userId: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
      })
      .from(courses)
      .leftJoin(
        studentCourses,
        and(
          eq(courses.id, studentCourses.courseId),
          eq(studentCourses.studentId, userId),
        ),
      )
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");

    if (course.enrolled)
      throw new ConflictException("Course is already enrolled");

    await this.db.transaction(async (trx) => {
      const [enrolledCourse] = await trx
        .insert(studentCourses)
        .values({ studentId: userId, courseId: id })
        .returning();

      if (!enrolledCourse) throw new ConflictException("Course not enrolled");
    });
  }

  async unenrollCourse(id: string, userId: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
      })
      .from(courses)
      .leftJoin(
        studentCourses,
        and(
          eq(courses.id, studentCourses.courseId),
          eq(studentCourses.studentId, userId),
        ),
      )
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");

    if (!course.enrolled) throw new ConflictException("Course is not enrolled");

    await this.db.transaction(async (trx) => {
      const [deletedCourse] = await trx
        .delete(studentCourses)
        .where(
          and(
            eq(studentCourses.courseId, id),
            eq(studentCourses.studentId, userId),
          ),
        )
        .returning();

      if (!deletedCourse) throw new ConflictException("Course not unenrolled");
    });
  }

  private async addS3SignedUrls(
    data: AllCoursesResponse,
  ): Promise<AllCoursesResponse> {
    return Promise.all(
      data.map(async (item) => {
        if (item.imageUrl) {
          if (item.imageUrl.startsWith("https://")) return item;

          try {
            const signedUrl = await this.s3Service.getSignedUrl(item.imageUrl);
            return { ...item, imageUrl: signedUrl };
          } catch (error) {
            console.error(
              `Failed to get signed URL for ${item.imageUrl}:`,
              error,
            );
            return item;
          }
        }
        return item;
      }),
    );
  }

  private getSelectField(userId: string) {
    return {
      id: courses.id,
      description: sql<string>`${courses.description}`,
      title: courses.title,
      imageUrl: courses.imageUrl,
      author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
      category: sql<string>`categories.title`,
      enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
      enrolledParticipantCount: count(studentCourses.courseId),
      courseLessonCount: sql<number>`
        (SELECT COUNT(*)
        FROM ${courseLessons}
        JOIN ${lessons} ON ${courseLessons.lessonId} = ${lessons.id}
        WHERE ${courseLessons.courseId} = ${courses.id}
          AND ${lessons.state} = 'published'
          AND ${lessons.archived} = false)::INTEGER`,
      completedLessonCount: sql<number>`
        (SELECT COUNT(*)
        FROM ${courseLessons}
        JOIN ${lessons} ON ${courseLessons.lessonId} = ${lessons.id}
        WHERE ${courseLessons.courseId} = ${courses.id}
          AND ${lessons.state} = 'published'
          AND ${lessons.archived} = false
          AND (
            SELECT COUNT(*)
            FROM ${lessonItems}
            WHERE ${lessonItems.lessonId} = ${lessons.id}
              AND ${lessonItems.lessonItemType} != 'text_block'
          ) = (
            SELECT COUNT(*)
            FROM ${studentCompletedLessonItems}
            WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
              AND ${studentCompletedLessonItems.studentId} = ${userId}
          )
        )::INTEGER`,
      priceInCents: courses.priceInCents,
      currency: courses.currency,
    };
  }

  private getFiltersConditions(filters: CoursesFilterSchema) {
    const conditions = [eq(courses.state, "published")];
    if (filters.title) {
      conditions.push(ilike(courses.title, `%${filters.title.toLowerCase()}%`));
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
