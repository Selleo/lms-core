import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  and,
  asc,
  between,
  count,
  countDistinct,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  sql,
} from "drizzle-orm";

import { LESSON_ITEM_TYPE, LESSON_TYPE } from "src/chapter/chapter.type";
import { AdminChapterRepository } from "src/chapter/repositories/adminChapter.repository";
import { ChapterProgress } from "src/chapter/schemas/chapter.types";
import { DatabasePg } from "src/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { FileService } from "src/file/file.service";
import { LESSON_TYPES } from "src/lesson/lesson.type";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { getSortOptions } from "../common/helpers/getSortOptions";
import {
  categories,
  chapters,
  courses,
  coursesSummaryStats,
  lessons,
  questions,
  studentChapterProgress,
  studentCourses,
  studentLessonProgress,
  studentQuestionAnswers,
  users,
} from "../storage/schema";

import {
  type CoursesFilterSchema,
  type CourseSortField,
  CourseSortFields,
  type CoursesQuery,
} from "./schemas/courseQuery";

import type { AllCoursesForTeacherResponse, AllCoursesResponse } from "./schemas/course.schema";
import type { CreateCourseBody } from "./schemas/createCourse.schema";
import type { CommonShowCourse } from "./schemas/showCourseCommon.schema";
import type { UpdateCourseBody } from "./schemas/updateCourse.schema";
import type { ChapterProgressType } from "src/chapter/schemas/chapter.types";
import type { Pagination, UUIDType } from "src/common";
import type { LessonItemWithContentSchema } from "src/lesson/lessonItem.schema";

@Injectable()
export class CourseService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly adminChapterRepository: AdminChapterRepository,
    private readonly fileService: FileService,
    private readonly statisticsRepository: StatisticsRepository,
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
      currentUserId,
      currentUserRole,
    } = query;

    // const { sortOrder, sortedField } = getSortOptions(sort);
    const sortOrder = asc;
    const sortedField = CourseSortFields.title;

    return await this.db.transaction(async (trx) => {
      const conditions = this.getFiltersConditions(filters, false);

      if (currentUserRole === USER_ROLES.teacher && currentUserId) {
        conditions.push(eq(courses.authorId, currentUserId));
      }

      const queryDB = trx
        .select({
          id: courses.id,
          description: sql<string>`${courses.description}`,
          title: courses.title,
          thumbnailUrl: courses.thumbnailS3Key,
          author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
          category: sql<string>`${categories.title}`,
          enrolledParticipantCount: sql<number>`COALESCE(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}, 0)`,
          courseChapterCount: courses.chapterCount,
          completedChapterCount: sql<number>`COALESCE(${studentCourses.finishedChapterCount}, 0)`,
          priceInCents: courses.priceInCents,
          currency: courses.currency,
          isPublished: courses.isPublished,
          createdAt: courses.createdAt,
        })
        .from(courses)
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(studentCourses, eq(courses.id, studentCourses.courseId))
        .leftJoin(coursesSummaryStats, eq(courses.id, coursesSummaryStats.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.thumbnailS3Key,
          courses.description,
          users.firstName,
          users.lastName,
          categories.title,
          courses.priceInCents,
          courses.currency,
          courses.isPublished,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedChapterCount,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)));

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

    return this.db.transaction(async (trx) => {
      const conditions = [eq(studentCourses.studentId, userId), eq(courses.isPublished, true)];
      conditions.push(...this.getFiltersConditions(filters));

      const queryDB = trx
        .select(this.getSelectField())
        .from(studentCourses)
        .innerJoin(courses, eq(studentCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(coursesSummaryStats, eq(courses.id, coursesSummaryStats.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.thumbnailS3Key,
          courses.description,
          courses.authorId,
          users.firstName,
          users.lastName,
          users.email,
          studentCourses.studentId,
          categories.title,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedChapterCount,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)));

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [{ totalItems }] = await trx
        .select({ totalItems: countDistinct(courses.id) })
        .from(studentCourses)
        .innerJoin(courses, eq(studentCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
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

  async getAvailableCourses(
    query: CoursesQuery,
    currentUserId: UUIDType,
  ): Promise<{ data: AllCoursesResponse; pagination: Pagination }> {
    const {
      sort = CourseSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
    } = query;
    const { sortOrder, sortedField } = getSortOptions(sort);

    return this.db.transaction(async (trx) => {
      const notEnrolledCourses: Record<string, string>[] = await trx.execute(sql`
        SELECT ${courses.id} AS "courseId"
        FROM ${courses}
        WHERE ${courses.id} NOT IN (
          SELECT DISTINCT ${studentCourses.courseId}
          FROM ${studentCourses}
          WHERE ${studentCourses.studentId} = ${currentUserId}
        )`);
      const notEnrolledCourseIds = notEnrolledCourses.map(({ courseId }) => courseId);

      const conditions = [eq(courses.isPublished, true)];
      conditions.push(...this.getFiltersConditions(filters));
      if (notEnrolledCourses.length > 0) {
        conditions.push(inArray(courses.id, notEnrolledCourseIds));
      }

      const queryDB = trx
        .select({
          id: courses.id,
          description: sql<string>`${courses.description}`,
          title: courses.title,
          thumbnailUrl: sql<string>`${courses.thumbnailS3Key}`,
          authorId: sql<string>`${courses.authorId}`,
          author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
          authorEmail: sql<string>`${users.email}`,
          category: sql<string>`${categories.title}`,
          enrolled: sql<boolean>`FALSE`,
          enrolledParticipantCount: sql<number>`COALESCE(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}, 0)`,
          courseChapterCount: courses.chapterCount,
          completedChapterCount: sql<number>`0`,
          priceInCents: courses.priceInCents,
          currency: courses.currency,
          hasFreeChapters: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM ${chapters}
          WHERE ${chapters.courseId} = ${courses.id}
            AND ${chapters.isFreemium} = TRUE
        )`,
        })
        .from(courses)
        .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(coursesSummaryStats, eq(courses.id, coursesSummaryStats.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.thumbnailS3Key,
          courses.description,
          courses.authorId,
          users.firstName,
          users.lastName,
          users.email,
          studentCourses.studentId,
          categories.title,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedChapterCount,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)));

      const dynamicQuery = queryDB.$dynamic();
      const paginatedQuery = addPagination(dynamicQuery, page, perPage);
      const data = await paginatedQuery;
      const [{ totalItems }] = await trx
        .select({ totalItems: countDistinct(courses.id) })
        .from(courses)
        .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
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

  async getCourse(id: string, userId: string): Promise<CommonShowCourse> {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        thumbnailS3Key: sql<string>`${courses.thumbnailS3Key}`,
        category: categories.title,
        description: sql<string>`${courses.description}`,
        courseChapterCount: courses.chapterCount,
        completedChapterCount: sql<number>`COALESCE(${studentCourses.finishedChapterCount}, 0)`,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN TRUE ELSE FALSE END`,
        isPublished: courses.isPublished,
        isScorm: courses.isScorm,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        authorId: courses.authorId,
        // is no needed on frontend *
        author: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        // is no needed on frontend *
        authorEmail: sql<string>`${users.email}`,
        hasFreeChapter: sql<boolean>`
          EXISTS (
            SELECT 1
            FROM ${chapters}
            WHERE ${chapters.courseId} = ${courses.id}
              AND ${chapters.isFreemium} = TRUE
          )`,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .innerJoin(users, eq(courses.authorId, users.id))
      .leftJoin(
        studentCourses,
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    // TODO: to remove and start use getLessonsDetails form lessonsRepository
    const courseChapterList = await this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        isSubmitted: sql<boolean>`
          EXISTS (
            SELECT 1
            FROM ${studentChapterProgress}
            WHERE ${studentChapterProgress.chapterId} = ${chapters.id}
              AND ${studentChapterProgress.courseId} = ${course.id}
              AND ${studentChapterProgress.studentId} = ${userId}
              AND ${studentChapterProgress.completedAt} IS NOT NULL
          )::BOOLEAN`,
        lessonCount: chapters.lessonCount,
        quizCount: sql<number>`
          (SELECT COUNT(*)
          FROM ${lessons}
          WHERE ${lessons.chapterId} = ${chapters.id}
            AND ${lessons.type} = ${LESSON_TYPE.quiz.key})::INTEGER`,
        completedLessonCount: sql<number>`COALESCE(${studentChapterProgress.completedLessonCount}, 0)`,
        // TODO: add lessonProgressState to student lessons progress table
        chapterProgress: sql<ChapterProgressType>`
          (CASE
            WHEN (
              SELECT COUNT(*)
              FROM ${lessons}
              WHERE ${lessons.chapterId} = ${chapters.id}
                AND ${lessons.type} != ${LESSON_ITEM_TYPE.text_block.key}
            ) = (
              SELECT COUNT(*)
              FROM ${studentLessonProgress}
              LEFT JOIN ${lessons} ON ${lessons.chapterId} = ${chapters.id}
              WHERE ${studentLessonProgress.lessonId} = ${lessons.id}
                AND ${studentLessonProgress.studentId} = ${userId}
            )
            THEN ${ChapterProgress.completed}
            WHEN (
              SELECT COUNT(*)
              FROM ${studentLessonProgress}
              LEFT JOIN ${lessons} ON ${lessons.id} = ${studentLessonProgress.lessonId}
              WHERE ${studentLessonProgress.lessonId} = ${lessons.id}
                AND ${studentLessonProgress.studentId} = ${userId}
            ) > 0
            THEN ${ChapterProgress.inProgress}
            ELSE ${ChapterProgress.notStarted}
          END)
        `,
        isFree: chapters.isFreemium,
        lessons: sql<string>`
          COALESCE(
            (
              SELECT json_agg(lesson_data)
              FROM (
                SELECT
                  ${lessons.id} AS id,
                  ${lessons.title} AS title,
                  ${lessons.type} AS type,
                  ${lessons.displayOrder} AS "displayOrder",
                  CASE
                    WHEN ${studentLessonProgress.completedAt} IS NOT NULL THEN 'completed'
                    WHEN ${studentLessonProgress.completedAt} IS NULL
                      AND ${studentLessonProgress.completedQuestionCount} > 0 THEN 'in_progress'
                    ELSE 'not_started'
                  END AS status,
                  CASE
                    WHEN ${lessons.type} = ${LESSON_TYPES.quiz} THEN COUNT(${questions.id})
                    ELSE NULL
                  END AS "quizQuestionCount"
                FROM ${lessons}
                LEFT JOIN ${studentLessonProgress} ON ${lessons.id} = ${studentLessonProgress.lessonId}
                  AND ${studentLessonProgress.studentId} = ${userId}
                LEFT JOIN ${questions} ON ${lessons.id} = ${questions.lessonId}
                WHERE ${lessons.chapterId} = ${chapters.id}
                GROUP BY
                  ${lessons.id},
                  ${lessons.type},
                  ${lessons.displayOrder},
                  ${lessons.title},
                  ${studentLessonProgress.completedAt},
                  ${studentLessonProgress.completedQuestionCount}
                ORDER BY ${lessons.displayOrder}
              ) AS lesson_data
            ),
            '[]'::json
          )
        `,
      })
      .from(chapters)
      .leftJoin(studentChapterProgress, eq(studentChapterProgress.chapterId, chapters.id))
      .where(
        and(eq(chapters.courseId, id), eq(chapters.isPublished, true), isNotNull(chapters.title)),
      )
      .orderBy(chapters.displayOrder);

    // TODO: temporary firx
    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url ?? "";
      return await this.fileService.getFileUrl(url);
    };

    const thumbnailUrl = await getImageUrl(course.thumbnailS3Key);

    return {
      ...course,
      thumbnailUrl,
      chapters: courseChapterList,
    };
  }

  async getBetaCourseById(id: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        thumbnailUrl: sql<string>`COALESCE(${courses.thumbnailS3Key}, '')`,
        category: categories.title,
        categoryId: categories.id,
        description: sql<string>`${courses.description}`,
        courseChapterCount: courses.chapterCount,
        isPublished: courses.isPublished,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    const courseChapterList = await this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        displayOrder: chapters.displayOrder,
        lessonCount: chapters.lessonCount,
        isFree: chapters.isFreemium,
        // TODO: it not working, what is that???
        lessons: sql<string>`
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', lessons.id,
                  'lessonType', lessons.type,
                  'displayOrder', lessons.display_order
                )
              )
              FROM ${lessons}
              WHERE lessons.chapter_id = ${chapters.id}
            ),
            '[]'::json
          )
        `,
      })
      .from(chapters)
      .where(and(eq(chapters.courseId, id), isNotNull(chapters.title)))
      .orderBy(chapters.displayOrder);

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.fileService.getFileUrl(url);
    };

    const thumbnailUrl = await getImageUrl(course.thumbnailUrl);

    // TODO: check if this is needed
    const updatedCourseLessonList = await Promise.all(
      courseChapterList?.map(async (chapter) => {
        // const lessons: LessonItemWithContentSchema[] =
        //   Array.isArray(chapter?.lessons) && chapter.lessons.length > 0
        //     ? await this.adminChapterRepository.getBetaChapterLessons(chapter.id)
        //     : [];

        const lessons: LessonItemWithContentSchema[] =
          await this.adminChapterRepository.getBetaChapterLessons(chapter.id);

        const lessonsWithSignedUrls = await this.addS3SignedUrlsToLessons(lessons);

        return {
          ...chapter,
          lessons: lessonsWithSignedUrls,
        };
      }),
    );

    return {
      ...course,
      thumbnailUrl,
      chapters: updatedCourseLessonList ?? [],
    };
  }

  async getCourseById(id: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        thumbnailUrl: sql<string>`${courses.thumbnailS3Key}`,
        category: categories.title,
        categoryId: categories.id,
        description: sql<string>`${courses.description}`,
        courseChapterCount: courses.chapterCount,
        priceInCents: courses.priceInCents,
        isPublished: courses.isPublished,
        currency: courses.currency,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    const courseChapterList = await this.db
      .select({
        id: chapters.id,
        title: chapters.title,
        lessonCount: chapters.lessonCount,
        isFree: chapters.isFreemium,
      })
      .from(chapters)
      .where(
        and(
          eq(chapters.courseId, id),
          eq(chapters.isPublished, true),
          isNotNull(chapters.id),
          isNotNull(chapters.title),
        ),
      )
      .orderBy(chapters.displayOrder);

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.fileService.getFileUrl(url);
    };

    const thumbnailUrl = await getImageUrl(course.thumbnailUrl);

    return {
      ...course,
      thumbnailUrl,
      chapters: courseChapterList,
    };
  }

  //TODO: Needs to be refactored
  async getTeacherCourses(authorId: UUIDType): Promise<AllCoursesForTeacherResponse> {
    return this.db
      .select({
        id: courses.id,
        description: sql<string>`${courses.description}`,
        title: courses.title,
        thumbnailUrl: courses.thumbnailS3Key,
        authorId: sql<string>`${courses.authorId}`,
        author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
        authorEmail: sql<string>`${users.email}`,
        category: sql<string>`${categories.title}`,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
        enrolledParticipantCount: sql<number>`0`,
        courseChapterCount: courses.chapterCount,
        completedChapterCount: sql<number>`0`,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        hasFreeChapters: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM ${chapters}
          WHERE ${chapters.courseId} = ${courses.id}
            AND ${chapters.isFreemium} = true
        )`,
      })
      .from(courses)
      .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .leftJoin(users, eq(courses.authorId, users.id))
      .where(
        and(
          eq(courses.isPublished, true),
          isNull(studentCourses.studentId),
          eq(courses.authorId, authorId),
        ),
      )
      .groupBy(
        courses.id,
        courses.title,
        courses.thumbnailS3Key,
        courses.description,
        courses.authorId,
        users.firstName,
        users.lastName,
        users.email,
        studentCourses.studentId,
        categories.title,
      )
      .orderBy(
        sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NULL THEN TRUE ELSE FALSE END`,
        courses.title,
      );
  }

  async createCourse(createCourseBody: CreateCourseBody, authorId: UUIDType) {
    return this.db.transaction(async (trx) => {
      const [category] = await trx
        .select()
        .from(categories)
        .where(eq(categories.id, createCourseBody.categoryId));

      if (!category) {
        throw new NotFoundException("Category not found");
      }

      const [newCourse] = await trx
        .insert(courses)
        .values({
          title: createCourseBody.title,
          description: createCourseBody.description,
          thumbnailS3Key: createCourseBody.thumbnailS3Key,
          isPublished: createCourseBody.isPublished,
          priceInCents: createCourseBody.priceInCents,
          currency: createCourseBody.currency || "usd",
          isScorm: createCourseBody.isScorm,
          authorId,
          categoryId: createCourseBody.categoryId,
        })
        .returning();

      if (!newCourse) {
        throw new ConflictException("Failed to create course");
      }

      // TODO: its not necessary to create chapters

      // if (createCourseBody.chapters && createCourseBody.chapters.length > 0) {
      //   const courseChaptersData = createCourseBody.chapters.map((chapterId, index) => ({
      //     courseId: newCourse.id,
      //     chapterId,
      //     displayOrder: index + 1,
      //   }));

      //   await trx.insert(courseLessons).values(courseChaptersData);
      // }

      // TODO: its not necessary to create chapters
      // if (newCourse.imageUrl) {
      //   newCourse.imageUrl = await this.fileService.getFileUrl(newCourse.imageUrl);
      // }

      await trx.insert(coursesSummaryStats).values({ courseId: newCourse.id, authorId });

      return newCourse;
    });
  }

  async updateCourse(
    id: string,
    updateCourseBody: UpdateCourseBody,
    image?: Express.Multer.File,
    currentUserId?: UUIDType,
  ) {
    return this.db.transaction(async (trx) => {
      const [existingCourse] = await trx.select().from(courses).where(eq(courses.id, id));

      if (!existingCourse) {
        throw new NotFoundException("Course not found");
      }

      if (existingCourse.authorId !== currentUserId) {
        throw new ForbiddenException("You don't have permission to update course");
      }

      if (updateCourseBody.categoryId) {
        const [category] = await trx
          .select()
          .from(categories)
          .where(eq(categories.id, updateCourseBody.categoryId));

        if (!category) {
          throw new NotFoundException("Category not found");
        }
      }

      // TODO: to remove and start use file service
      let imageKey = undefined;
      if (image) {
        try {
          const fileExtension = image.originalname.split(".").pop();
          const resource = `courses/${crypto.randomUUID()}.${fileExtension}`;
          imageKey = await this.fileService.uploadFile(image, resource);
        } catch (error) {
          throw new ConflictException("Failed to upload course image");
        }
      }

      const updateData = {
        ...updateCourseBody,
        ...(imageKey && { imageUrl: imageKey.fileUrl }),
      };

      const [updatedCourse] = await trx
        .update(courses)
        .set(updateData)
        .where(eq(courses.id, id))
        .returning();

      if (!updatedCourse) {
        throw new ConflictException("Failed to update course");
      }

      // TODO: its not necessary to create chapters
      // if (updatedCourse.imageUrl) {
      //   updatedCourse.imageUrl = await this.fileService.getFileUrl(updatedCourse.imageUrl);
      // }

      return updatedCourse;
    });
  }

  async enrollCourse(id: string, studentId: string, testKey?: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN TRUE ELSE FALSE END`,
        price: courses.priceInCents,
      })
      .from(courses)
      .leftJoin(
        studentCourses,
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, studentId)),
      )
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    if (course.enrolled) throw new ConflictException("Course is already enrolled");

    /*
     For Playwright tests to bypass Stripe payment
     Front-end interfaces, such as Stripe Checkout or the Payment Element, have security measures in place that prevent automated testing, and Stripe APIs are rate limited.
   */
    const isTest = testKey && testKey === process.env.TEST_KEY;
    if (!isTest && Boolean(course.price)) throw new ForbiddenException();

    await this.db.transaction(async (trx) => {
      const [enrolledCourse] = await trx
        .insert(studentCourses)
        .values({ studentId: studentId, courseId: id })
        .returning();

      if (!enrolledCourse) throw new ConflictException("Course not enrolled");

      const courseChapterList = await trx
        .select({
          id: chapters.id,
          itemCount: chapters.lessonCount,
        })
        .from(chapters)
        .leftJoin(lessons, eq(lessons.chapterId, chapters.id))
        .where(and(eq(chapters.courseId, course.id), eq(chapters.isPublished, true)))
        .groupBy(chapters.id);

      if (courseChapterList.length > 0) {
        await trx.insert(studentChapterProgress).values(
          courseChapterList.map((chapter) => ({
            studentId,
            chapterId: chapter.id,
            courseId: course.id,
            completedLessonItemCount: 0,
          })),
        );

        courseChapterList.forEach(async (chapter) => {
          const chapterLessons = await trx
            .select({ id: lessons.id, type: lessons.type })
            .from(lessons)
            .where(eq(lessons.chapterId, chapter.id));

          await trx.insert(studentLessonProgress).values(
            chapterLessons.map((lesson) => ({
              studentId,
              lessonId: lesson.id,
              completedQuestionCount: 0,
              quizScore: lesson.type === LESSON_TYPES.quiz ? 0 : null,
              completedAt: null,
            })),
          );
        });
      }

      // TODO: add lesson progress records

      await this.statisticsRepository.updateFreePurchasedCoursesStats(course.id, trx);
    });
  }

  async unenrollCourse(id: string, userId: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      })
      .from(courses)
      .leftJoin(
        studentCourses,
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    if (!course.enrolled) throw new ConflictException("Course is not enrolled");

    await this.db.transaction(async (trx) => {
      const [deletedCourse] = await trx
        .delete(studentCourses)
        .where(and(eq(studentCourses.courseId, id), eq(studentCourses.studentId, userId)))
        .returning();

      if (!deletedCourse) throw new ConflictException("Course not unenrolled");

      const courseChapterList = await trx
        .select({ id: chapters.id })
        .from(chapters)
        .where(eq(chapters.courseId, id));

      const courseChapterIds = courseChapterList.map((l) => l.id);

      await trx
        .delete(studentChapterProgress)
        .where(
          and(
            eq(studentChapterProgress.courseId, id),
            inArray(studentChapterProgress.chapterId, courseChapterIds),
            eq(studentChapterProgress.studentId, userId),
          ),
        )
        .returning();

      const courseQuestionList = await trx
        .select({ id: questions.id })
        .from(questions)
        .leftJoin(lessons, eq(lessons.id, questions.lessonId))
        .leftJoin(chapters, eq(chapters.id, lessons.chapterId))
        .where(eq(chapters.courseId, id));
      const courseStudentQuestionIds = courseQuestionList.map((question) => question.id);

      await trx
        .delete(studentQuestionAnswers)
        .where(
          and(
            inArray(studentQuestionAnswers.questionId, courseStudentQuestionIds),
            eq(studentQuestionAnswers.studentId, userId),
          ),
        )
        .returning();

      await trx
        .delete(studentLessonProgress)
        .where(
          and(
            inArray(studentLessonProgress.lessonId, courseChapterIds),
            eq(studentLessonProgress.studentId, userId),
          ),
        )
        .returning();
    });
  }

  private async addS3SignedUrls(data: AllCoursesResponse): Promise<AllCoursesResponse> {
    return Promise.all(
      data.map(async (item) => {
        if (item.thumbnailUrl) {
          if (item.thumbnailUrl.startsWith("https://")) return item;

          try {
            const signedUrl = await this.fileService.getFileUrl(item.thumbnailUrl);
            return { ...item, thumbnailUrl: signedUrl };
          } catch (error) {
            console.error(`Failed to get signed URL for ${item.thumbnailUrl}:`, error);
            return item;
          }
        }
        return item;
      }),
    );
  }

  private async addS3SignedUrlsToLessons(lessons: LessonItemWithContentSchema[]) {
    return await Promise.all(
      lessons.map(async (item) => {
        if (
          item.fileS3Key &&
          (item.type === LESSON_TYPES.video || item.type === LESSON_TYPES.presentation)
        ) {
          if (item.fileS3Key.startsWith("https://")) {
            return item;
          }

          try {
            const signedUrl = await this.fileService.getFileUrl(item.fileS3Key);
            return { ...item, fileS3Key: signedUrl };
          } catch (error) {
            console.error(`Failed to get signed URL for ${item.fileS3Key}:`, error);
            return item;
          }
        }
        return item;
      }),
    );
  }

  private getSelectField() {
    return {
      id: courses.id,
      description: sql<string>`${courses.description}`,
      title: courses.title,
      thumbnailUrl: courses.thumbnailS3Key,
      authorId: sql<string>`${courses.authorId}`,
      author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
      authorEmail: sql<string>`${users.email}`,
      category: sql<string>`${categories.title}`,
      enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      enrolledParticipantCount: sql<number>`COALESCE(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}, 0)`,
      courseChapterCount: courses.chapterCount,
      completedChapterCount: sql<number>`COALESCE(${studentCourses.finishedChapterCount}, 0)`,
      priceInCents: courses.priceInCents,
      currency: courses.currency,
      hasFreeChapter: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM ${chapters}
          WHERE ${chapters.courseId} = ${courses.id}
            AND ${chapters.isFreemium} = TRUE
        )`,
    };
  }

  private getFiltersConditions(filters: CoursesFilterSchema, publishedOnly = true) {
    const conditions = [];
    if (filters.title) {
      conditions.push(ilike(courses.title, `%${filters.title.toLowerCase()}%`));
    }
    if (filters.category) {
      conditions.push(like(categories.title, `%${filters.category}%`));
    }
    if (filters.author) {
      const authorNameConcat = sql`CONCAT(${users.firstName}, ' ' , ${users.lastName})`;
      conditions.push(sql`${authorNameConcat} LIKE ${`%${filters.author}%`}`);
    }
    if (filters.creationDateRange) {
      const [startDate, endDate] = filters.creationDateRange;
      const start = new Date(startDate).toISOString();
      const end = new Date(endDate).toISOString();

      conditions.push(between(courses.createdAt, start, end));
    }
    if (filters.isPublished) {
      conditions.push(eq(courses.isPublished, filters.isPublished));
    }

    if (publishedOnly) {
      conditions.push(eq(courses.isPublished, true));
    }

    return conditions ?? undefined;
  }

  // TODO: repair last 2 functions
  private getColumnToSortBy(sort: CourseSortField) {
    switch (sort) {
      case CourseSortFields.author:
        return sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`;
      case CourseSortFields.category:
        return categories.title;
      case CourseSortFields.creationDate:
        return courses.createdAt;
      case CourseSortFields.chapterCount:
        return count(studentCourses.courseId);
      case CourseSortFields.enrolledParticipantsCount:
        return count(studentCourses.courseId);
      default:
        return courses.title;
    }
  }
}
