import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import type { DatabasePg, Pagination } from "src/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { S3Service } from "src/file/s3.service";
import { getSortOptions } from "../common/helpers/getSortOptions";
import {
  categories,
  courseLessons,
  courses,
  lessonItems,
  lessons,
  studentCompletedLessonItems,
  studentCourses,
  studentLessonsProgress,
  users,
} from "../storage/schema";
import type { CoursesQuery } from "./api/courses.types";
import type { AllCoursesResponse } from "./schemas/course.schema";
import {
  type CoursesFilterSchema,
  type CourseSortField,
  CourseSortFields,
} from "./schemas/courseQuery";
import { CreateCourseBody } from "./schemas/createCourse.schema";
import { UpdateCourseBody } from "./schemas/updateCourse.schema";

@Injectable()
export class CoursesService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async getAllCourses(query: CoursesQuery): Promise<{
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

    return await this.db.transaction(async (tx) => {
      const conditions = this.getFiltersConditions(filters, false);

      const queryDB = tx
        .select({
          id: courses.id,
          description: sql<string>`${courses.description}`,
          title: courses.title,
          imageUrl: courses.imageUrl,
          author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
          category: sql<string>`${categories.title}`,
          enrolledParticipantCount: count(studentCourses.courseId),
          courseLessonCount: count(courseLessons.id),
          completedLessonCount: sql<number>`0::INTEGER`,
          priceInCents: courses.priceInCents,
          currency: courses.currency,
          state: courses.state,
          archived: courses.archived,
        })
        .from(courses)
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          courses.description,
          users.firstName,
          users.lastName,
          categories.title,
          courses.priceInCents,
          courses.currency,
          courses.state,
          courses.archived,
        )
        .orderBy(
          sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)),
        );

      const data = await queryDB;

      const dataWithS3SignedUrls = await this.addS3SignedUrls(data);

      const totalItems = data.length;

      return {
        data: dataWithS3SignedUrls,
        pagination: {
          totalItems,
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
        type: lessons.type,
        isSubmitted: sql<boolean>`EXISTS (SELECT 1 FROM ${studentLessonsProgress} WHERE ${studentLessonsProgress.lessonId} = ${lessons.id} AND ${studentLessonsProgress.studentId} = ${userId} AND ${studentLessonsProgress.quizCompleted})::BOOLEAN`,
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

    const imageUrl = (course.imageUrl as string).startsWith("https://")
      ? course.imageUrl
      : await this.s3Service.getSignedUrl(course.imageUrl);

    return {
      ...course,
      imageUrl,
      lessons: courseLessonList,
    };
  }

  async getCourseById(id: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: courses.imageUrl,
        category: categories.title,
        categoryId: categories.id,
        description: sql<string>`${courses.description}`,
        courseLessonCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${courseLessons}
          JOIN ${lessons} ON ${courseLessons.lessonId} = ${lessons.id}
          WHERE ${courseLessons.courseId} = ${courses.id} AND ${lessons.state} = 'published' AND ${lessons.archived} = false)::INTEGER`,
        state: courses.state,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        archived: courses.archived,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");
    // TODO: if (!course.imageUrl) throw new ConflictException("Course has no image");

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

    // TODO:
    // const imageUrl = (course.imageUrl as string).startsWith("https://")
    //   ? course.imageUrl
    //   : await this.s3Service.getSignedUrl(course.imageUrl);

    return {
      ...course,
      // imageUrl,
      lessons: courseLessonList ?? [],
    };
  }

  async createCourse(createCourseBody: CreateCourseBody, authorId: string) {
    return this.db.transaction(async (tx) => {
      const [category] = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, createCourseBody.categoryId));

      if (!category) {
        throw new NotFoundException("Category not found");
      }

      const [author] = await tx
        .select()
        .from(users)
        .where(eq(users.id, authorId));

      if (!author) {
        throw new NotFoundException("Author not found");
      }

      const [newCourse] = await tx
        .insert(courses)
        .values({
          title: createCourseBody.title,
          description: createCourseBody.description,
          imageUrl: createCourseBody.imageUrl,
          state: createCourseBody.state || "draft",
          priceInCents: createCourseBody.priceInCents,
          currency: createCourseBody.currency || "usd",
          authorId: authorId,
          categoryId: createCourseBody.categoryId,
        })
        .returning();

      if (!newCourse) {
        throw new ConflictException("Failed to create course");
      }

      if (createCourseBody.lessons && createCourseBody.lessons.length > 0) {
        const courseLessonsData = createCourseBody.lessons.map(
          (lessonId, index) => ({
            courseId: newCourse.id,
            lessonId: lessonId,
            displayOrder: index + 1,
          }),
        );

        await tx.insert(courseLessons).values(courseLessonsData);
      }

      if (newCourse.imageUrl) {
        newCourse.imageUrl = await this.s3Service.getSignedUrl(
          newCourse.imageUrl,
        );
      }

      return newCourse;
    });
  }

  async updateCourse(
    id: string,
    updateCourseBody: UpdateCourseBody,
    image?: Express.Multer.File,
  ) {
    return this.db.transaction(async (tx) => {
      if (updateCourseBody.categoryId) {
        const [category] = await tx
          .select()
          .from(categories)
          .where(eq(categories.id, updateCourseBody.categoryId));

        if (!category) {
          throw new NotFoundException("Category not found");
        }
      }

      let imageKey = undefined;
      if (image) {
        try {
          const fileExtension = image.originalname.split(".").pop();
          imageKey = `courses/${crypto.randomUUID()}.${fileExtension}`;
          await this.s3Service.uploadFile(
            image.buffer,
            imageKey,
            image.mimetype,
          );
        } catch (error) {
          throw new ConflictException("Failed to upload course image");
        }
      }

      const [existingCourse] = await tx
        .select()
        .from(courses)
        .where(eq(courses.id, id));

      if (!existingCourse) {
        throw new NotFoundException("Course not found");
      }

      const updateData = {
        ...updateCourseBody,
        ...(imageKey && { imageUrl: imageKey }),
      };

      const [updatedCourse] = await tx
        .update(courses)
        .set(updateData)
        .where(eq(courses.id, id))
        .returning();

      if (!updatedCourse) {
        throw new ConflictException("Failed to update course");
      }

      // if (imageKey && existingCourse.imageUrl !== imageKey) {
      //   TODO: remove old image
      // }

      if (updatedCourse.imageUrl) {
        updatedCourse.imageUrl = await this.s3Service.getSignedUrl(
          updatedCourse.imageUrl,
        );
      }

      return updatedCourse;
    });
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

      const quizLessons = await trx
        .select({ id: lessons.id })
        .from(courseLessons)
        .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
        .where(
          and(
            eq(courseLessons.courseId, course.id),
            eq(lessons.archived, false),
            eq(lessons.state, "published"),
            eq(lessons.type, "quiz"),
          ),
        );

      if (quizLessons.length > 0) {
        await trx.insert(studentLessonsProgress).values(
          quizLessons.map((lesson) => ({
            studentId: userId,
            lessonId: lesson.id,
            quizCompleted: false,
          })),
        );
      }
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

  private getFiltersConditions(
    filters: CoursesFilterSchema,
    publishedOnly = true,
  ) {
    const conditions = [];
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

    if (publishedOnly) {
      conditions.push(eq(courses.state, "published"));
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
