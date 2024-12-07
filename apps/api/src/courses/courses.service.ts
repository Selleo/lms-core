import {
  ConflictException,
  ForbiddenException,
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
  inArray,
  isNotNull,
  isNull,
  like,
  sql,
} from "drizzle-orm";

import { DatabasePg } from "src/common";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { STATES } from "src/common/states";
import { FilesService } from "src/file/files.service";
import { AdminLessonsService } from "src/lessons/adminLessons.service";
import { LESSON_ITEM_TYPE, LESSON_TYPE } from "src/lessons/lesson.type";
import { AdminLessonsRepository } from "src/lessons/repositories/adminLessons.repository";
import { LessonProgress } from "src/lessons/schemas/lesson.types";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { getSortOptions } from "../common/helpers/getSortOptions";
import {
  categories,
  courseLessons,
  courses,
  coursesSummaryStats,
  lessonItems,
  lessons,
  studentCompletedLessonItems,
  studentCourses,
  studentLessonsProgress,
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
import type { Pagination, UUIDType } from "src/common";
import type { LessonProgressType } from "src/lessons/schemas/lesson.types";
import type { LessonItemWithContentSchema } from "src/lessons/schemas/lessonItem.schema";

@Injectable()
export class CoursesService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly lessonService: AdminLessonsService,
    private readonly lessonRepository: AdminLessonsRepository,
    private readonly filesService: FilesService,
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

    const { sortOrder, sortedField } = getSortOptions(sort);

    return await this.db.transaction(async (tx) => {
      const conditions = this.getFiltersConditions(filters, false);

      if (currentUserRole === USER_ROLES.teacher && currentUserId) {
        conditions.push(eq(courses.authorId, currentUserId));
      }

      const queryDB = tx
        .select({
          id: courses.id,
          description: sql<string>`${courses.description}`,
          title: courses.title,
          imageUrl: courses.imageUrl,
          author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
          category: sql<string>`${categories.title}`,
          enrolledParticipantCount: sql<number>`COALESCE(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}, 0)`,
          courseLessonCount: courses.lessonsCount,
          completedLessonCount: sql<number>`COALESCE(${studentCourses.finishedLessonsCount}, 0)`,
          priceInCents: courses.priceInCents,
          currency: courses.currency,
          state: courses.state,
          archived: courses.archived,
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
          courses.imageUrl,
          courses.description,
          users.firstName,
          users.lastName,
          categories.title,
          courses.priceInCents,
          courses.currency,
          courses.state,
          courses.archived,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedLessonsCount,
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

    return this.db.transaction(async (tx) => {
      const conditions = [eq(studentCourses.studentId, userId)];
      conditions.push(...this.getFiltersConditions(filters));

      const queryDB = tx
        .select(this.getSelectField())
        .from(studentCourses)
        .innerJoin(courses, eq(studentCourses.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .leftJoin(coursesSummaryStats, eq(courses.id, coursesSummaryStats.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          courses.description,
          courses.authorId,
          users.firstName,
          users.lastName,
          users.email,
          studentCourses.studentId,
          categories.title,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedLessonsCount,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)));

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
          and(...conditions, eq(courses.state, STATES.published), eq(courses.archived, false)),
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
        eq(courses.state, STATES.published),
        eq(courses.archived, false),
        isNull(studentCourses.studentId),
      ];
      conditions.push(...this.getFiltersConditions(filters));

      const queryDB = tx
        .select(this.getSelectField())
        .from(courses)
        .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
        .leftJoin(categories, eq(courses.categoryId, categories.id))
        .leftJoin(users, eq(courses.authorId, users.id))
        .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
        .leftJoin(coursesSummaryStats, eq(courses.id, coursesSummaryStats.courseId))
        .where(and(...conditions))
        .groupBy(
          courses.id,
          courses.title,
          courses.imageUrl,
          courses.description,
          courses.authorId,
          users.firstName,
          users.lastName,
          users.email,
          studentCourses.studentId,
          categories.title,
          coursesSummaryStats.freePurchasedCount,
          coursesSummaryStats.paidPurchasedCount,
          studentCourses.finishedLessonsCount,
        )
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField as CourseSortField)));

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

  async getCourse(id: string, userId: string): Promise<CommonShowCourse> {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: sql<string>`${courses.imageUrl}`,
        category: categories.title,
        description: sql<string>`${courses.description}`,
        courseLessonCount: courses.lessonsCount,
        completedLessonCount: sql<number>`COALESCE(${studentCourses.finishedLessonsCount}, 0)`,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
        state: studentCourses.state,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        authorId: courses.authorId,
        author: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        authorEmail: sql<string>`${users.email}`,
        hasFreeLessons: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM ${courseLessons}
          WHERE ${courseLessons.courseId} = ${courses.id}
            AND ${courseLessons.isFree} = true
        )`,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .innerJoin(users, eq(courses.authorId, users.id))
      .leftJoin(
        studentCourses,
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, userId)),
      )
      .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");

    // TODO: to remove and start use getLessonsDetails form lessonsRepository
    const courseLessonList = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        type: lessons.type,
        isSubmitted: sql<boolean>`
          EXISTS (
            SELECT 1
            FROM ${studentLessonsProgress}
            WHERE ${studentLessonsProgress.lessonId} = ${lessons.id}
              AND ${studentLessonsProgress.courseId} = ${course.id}
              AND ${studentLessonsProgress.studentId} = ${userId}
              AND ${studentLessonsProgress.quizCompleted}
          )::BOOLEAN`,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        itemsCount: lessons.itemsCount,
        itemsCompletedCount: sql<number>`COALESCE(${studentLessonsProgress.completedLessonItemCount}, 0)`,
        // TODO: add lessonProgressState to student lessons progress table
        lessonProgress: sql<LessonProgressType>`
          (CASE
            WHEN (
              SELECT COUNT(*)
              FROM ${lessonItems}
              WHERE ${lessonItems.lessonId} = ${lessons.id}
                AND ${lessonItems.lessonItemType} != ${LESSON_ITEM_TYPE.text_block.key}
            ) = (
              SELECT COUNT(*)
              FROM ${studentCompletedLessonItems}
              WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
                AND ${studentCompletedLessonItems.courseId} = ${course.id}
                AND ${studentCompletedLessonItems.studentId} = ${userId}
            )
            THEN ${LessonProgress.completed}
            WHEN (
              SELECT COUNT(*)
              FROM ${studentCompletedLessonItems}
              WHERE ${studentCompletedLessonItems.lessonId} = ${lessons.id}
                AND ${studentCompletedLessonItems.courseId} = ${course.id}
                AND ${studentCompletedLessonItems.studentId} = ${userId}
            ) > 0
            THEN ${LessonProgress.inProgress}
            ELSE ${LessonProgress.notStarted}
          END)
        `,
        isFree: courseLessons.isFree,
      })
      .from(courseLessons)
      .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
      .leftJoin(studentLessonsProgress, eq(courseLessons.lessonId, studentLessonsProgress.lessonId))
      .where(
        and(
          eq(courseLessons.courseId, id),
          eq(lessons.archived, false),
          eq(lessons.state, STATES.published),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      );

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.filesService.getFileUrl(url);
    };

    const imageUrl = await getImageUrl(course.imageUrl);

    return {
      ...course,
      imageUrl,
      lessons: courseLessonList,
    };
  }

  async getBetaCourseById(id: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: sql<string>`${courses.imageUrl}`,
        category: categories.title,
        categoryId: categories.id,
        description: sql<string>`${courses.description}`,
        courseLessonCount: courses.lessonsCount,
        state: courses.state,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        archived: courses.archived,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    const courseLessonList = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`COALESCE(${lessons.description}, '')`,
        imageUrl: sql<string>`COALESCE(${lessons.imageUrl}, '')`,
        displayOrder: courseLessons.displayOrder,
        itemsCount: lessons.itemsCount,
        isFree: courseLessons.isFree,
        lessonItems: sql`
          (SELECT json_agg(
              json_build_object(
                'id', ${lessonItems.id},
                'lessonItemType', ${lessonItems.lessonItemType},
                'displayOrder', ${lessonItems.displayOrder}
              )
            )
          FROM ${lessonItems}
          WHERE ${lessonItems.lessonId} = ${lessons.id}) AS lessonItems`,
      })
      .from(courseLessons)
      .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
      .where(
        and(
          eq(courseLessons.courseId, id),
          eq(lessons.archived, false),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
        ),
      )
      .orderBy(courseLessons.displayOrder);

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.filesService.getFileUrl(url);
    };

    const imageUrl = await getImageUrl(course.imageUrl);

    const updatedCourseLessonList = await Promise.all(
      courseLessonList?.map(async (lesson) => {
        const lessonItemsWithContent =
          Array.isArray(lesson?.lessonItems) && lesson.lessonItems.length > 0
            ? await this.lessonRepository.getBetaLessons(lesson.id)
            : [];

        const processedLessonItems = await this.lessonService.processLessonItems(
          lessonItemsWithContent as LessonItemWithContentSchema[],
        );

        return {
          ...lesson,
          lessonItems: processedLessonItems,
        };
      }),
    );

    return {
      ...course,
      imageUrl,
      lessons: updatedCourseLessonList ?? [],
    };
  }

  async getCourseById(id: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: sql<string>`${courses.imageUrl}`,
        category: categories.title,
        categoryId: categories.id,
        description: sql<string>`${courses.description}`,
        courseLessonCount: courses.lessonsCount,
        state: courses.state,
        priceInCents: courses.priceInCents,
        currency: courses.currency,
        archived: courses.archived,
      })
      .from(courses)
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(eq(courses.id, id)));

    if (!course) throw new NotFoundException("Course not found");

    const courseLessonList = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        itemsCount: lessons.itemsCount,
        isFree: courseLessons.isFree,
      })
      .from(courseLessons)
      .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
      .where(
        and(
          eq(courseLessons.courseId, id),
          eq(lessons.archived, false),
          eq(lessons.state, STATES.published),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      );

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.filesService.getFileUrl(url);
    };

    const imageUrl = await getImageUrl(course.imageUrl);

    return {
      ...course,
      imageUrl,
      lessons: courseLessonList ?? [],
    };
  }

  async getTeacherCourses(authorId: UUIDType): Promise<AllCoursesForTeacherResponse> {
    return this.db
      .select(this.getSelectField())
      .from(courses)
      .leftJoin(studentCourses, eq(studentCourses.courseId, courses.id))
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .leftJoin(users, eq(courses.authorId, users.id))
      .leftJoin(courseLessons, eq(courses.id, courseLessons.courseId))
      .where(
        and(
          eq(courses.state, STATES.published),
          eq(courses.archived, false),
          eq(courses.authorId, authorId),
        ),
      )
      .groupBy(
        courses.id,
        courses.title,
        courses.imageUrl,
        courses.description,
        courses.authorId,
        users.firstName,
        users.lastName,
        users.email,
        studentCourses.studentId,
        categories.title,
        coursesSummaryStats.freePurchasedCount,
        coursesSummaryStats.paidPurchasedCount,
      )
      .orderBy(
        sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NULL THEN true ELSE false END`,
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

      const [author] = await trx.select().from(users).where(eq(users.id, authorId));

      if (!author) {
        throw new NotFoundException("Author not found");
      }

      const [newCourse] = await trx
        .insert(courses)
        .values({
          title: createCourseBody.title,
          description: createCourseBody.description,
          imageUrl: createCourseBody.imageUrl,
          state: createCourseBody.state || STATES.draft,
          priceInCents: createCourseBody.priceInCents,
          currency: createCourseBody.currency || "usd",
          authorId,
          categoryId: createCourseBody.categoryId,
        })
        .returning();

      if (!newCourse) {
        throw new ConflictException("Failed to create course");
      }

      if (createCourseBody.lessons && createCourseBody.lessons.length > 0) {
        const courseLessonsData = createCourseBody.lessons.map((lessonId, index) => ({
          courseId: newCourse.id,
          lessonId,
          displayOrder: index + 1,
        }));

        await trx.insert(courseLessons).values(courseLessonsData);
      }

      if (newCourse.imageUrl) {
        newCourse.imageUrl = await this.filesService.getFileUrl(newCourse.imageUrl);
      }

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
    return this.db.transaction(async (tx) => {
      const [existingCourse] = await tx.select().from(courses).where(eq(courses.id, id));

      if (!existingCourse) {
        throw new NotFoundException("Course not found");
      }

      if (existingCourse.authorId !== currentUserId) {
        throw new ForbiddenException("You don't have permission to update course");
      }

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
          const resource = `courses/${crypto.randomUUID()}.${fileExtension}`;
          imageKey = await this.filesService.uploadFile(image, resource);
        } catch (error) {
          throw new ConflictException("Failed to upload course image");
        }
      }

      const updateData = {
        ...updateCourseBody,
        ...(imageKey && { imageUrl: imageKey.fileUrl }),
      };

      const [updatedCourse] = await tx
        .update(courses)
        .set(updateData)
        .where(eq(courses.id, id))
        .returning();

      if (!updatedCourse) {
        throw new ConflictException("Failed to update course");
      }

      if (updatedCourse.imageUrl) {
        updatedCourse.imageUrl = await this.filesService.getFileUrl(updatedCourse.imageUrl);
      }

      return updatedCourse;
    });
  }

  async enrollCourse(id: string, userId: string, testKey?: string) {
    const [course] = await this.db
      .select({
        id: courses.id,
        enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
        price: courses.priceInCents,
      })
      .from(courses)
      .leftJoin(
        studentCourses,
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

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
        .values({ studentId: userId, courseId: id })
        .returning();

      if (!enrolledCourse) throw new ConflictException("Course not enrolled");

      const courseLessonList = await trx
        .select({
          id: lessons.id,
          lessonType: lessons.type,
          itemCount: lessons.itemsCount,
        })
        .from(courseLessons)
        .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
        .leftJoin(lessonItems, eq(lessons.id, lessonItems.lessonId))
        .where(
          and(
            eq(courseLessons.courseId, course.id),
            eq(lessons.archived, false),
            eq(lessons.state, STATES.published),
          ),
        )
        .groupBy(lessons.id);

      if (courseLessonList.length > 0) {
        await trx.insert(studentLessonsProgress).values(
          courseLessonList.map((lesson) => ({
            studentId: userId,
            lessonId: lesson.id,
            courseId: course.id,
            quizCompleted: lesson.lessonType === LESSON_TYPE.quiz.key ? false : null,
            quizScore: lesson.lessonType === LESSON_TYPE.quiz.key ? 0 : null,
            completedLessonItemCount: 0,
          })),
        );
      }

      await this.statisticsRepository.updateFreePurchasedCoursesStats(course.id, trx);
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
        and(eq(courses.id, studentCourses.courseId), eq(studentCourses.studentId, userId)),
      )
      .where(and(eq(courses.id, id), eq(courses.archived, false)));

    if (!course) throw new NotFoundException("Course not found");

    if (!course.enrolled) throw new ConflictException("Course is not enrolled");

    await this.db.transaction(async (trx) => {
      const [deletedCourse] = await trx
        .delete(studentCourses)
        .where(and(eq(studentCourses.courseId, id), eq(studentCourses.studentId, userId)))
        .returning();

      if (!deletedCourse) throw new ConflictException("Course not unenrolled");

      const courseLessonList = await trx
        .select({ id: courseLessons.lessonId })
        .from(courseLessons)
        .where(eq(courseLessons.courseId, id));

      const courseLessonsIds = courseLessonList.map((l) => l.id);

      await trx
        .delete(studentLessonsProgress)
        .where(
          and(
            eq(studentLessonsProgress.courseId, id),
            inArray(studentLessonsProgress.lessonId, courseLessonsIds),
            eq(studentLessonsProgress.studentId, userId),
          ),
        )
        .returning();

      await trx
        .delete(studentQuestionAnswers)
        .where(
          and(
            eq(studentQuestionAnswers.courseId, course.id),
            inArray(studentQuestionAnswers.lessonId, courseLessonsIds),
            eq(studentQuestionAnswers.studentId, userId),
          ),
        )
        .returning();

      await trx
        .delete(studentCompletedLessonItems)
        .where(
          and(
            eq(studentCompletedLessonItems.courseId, id),
            inArray(studentCompletedLessonItems.lessonId, courseLessonsIds),
            eq(studentCompletedLessonItems.studentId, userId),
          ),
        )
        .returning();
    });
  }

  private async addS3SignedUrls(data: AllCoursesResponse): Promise<AllCoursesResponse> {
    return Promise.all(
      data.map(async (item) => {
        if (item.imageUrl) {
          if (item.imageUrl.startsWith("https://")) return item;

          try {
            const signedUrl = await this.filesService.getFileUrl(item.imageUrl);
            return { ...item, imageUrl: signedUrl };
          } catch (error) {
            console.error(`Failed to get signed URL for ${item.imageUrl}:`, error);
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
      imageUrl: courses.imageUrl,
      authorId: sql<string>`${courses.authorId}`,
      author: sql<string>`CONCAT(${users.firstName} || ' ' || ${users.lastName})`,
      authorEmail: sql<string>`${users.email}`,
      category: sql<string>`${categories.title}`,
      enrolled: sql<boolean>`CASE WHEN ${studentCourses.studentId} IS NOT NULL THEN true ELSE false END`,
      enrolledParticipantCount: sql<number>`COALESCE(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}, 0)`,
      courseLessonCount: courses.lessonsCount,
      completedLessonCount: sql<number>`COALESCE(${studentCourses.finishedLessonsCount}, 0)`,
      priceInCents: courses.priceInCents,
      currency: courses.currency,
      hasFreeLessons: sql<boolean>`
        EXISTS (
          SELECT 1
          FROM ${courseLessons}
          WHERE ${courseLessons.courseId} = ${courses.id}
            AND ${courseLessons.isFree} = true
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
    if (filters.state) {
      conditions.push(eq(courses.state, filters.state));
    }
    if (filters.archived) {
      conditions.push(eq(courses.archived, filters.archived === "true"));
    }
    if (publishedOnly) {
      conditions.push(eq(courses.state, STATES.published));
    }

    return conditions ?? undefined;
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
