import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, ilike, sql } from "drizzle-orm";
import { isEmpty } from "lodash";
import { match, P } from "ts-pattern";

import { DatabasePg } from "src/common";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import { DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { FilesService } from "src/file/files.service";
import { courseLessons, lessonItems, lessons } from "src/storage/schema";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { AdminLessonsRepository } from "./repositories/adminLessons.repository";
import {
  type LessonsFilterSchema,
  type LessonSortField,
  LessonSortFields,
  type LessonsQuery,
} from "./schemas/lessonQuery";

import type { CreateLessonBody, UpdateLessonBody } from "./schemas/lesson.schema";
import type { LessonItemResponse, LessonItemWithContentSchema } from "./schemas/lessonItem.schema";
import type { UUIDType } from "src/common";

@Injectable()
export class AdminLessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly filesService: FilesService,
    private readonly adminLessonsRepository: AdminLessonsRepository,
  ) {}

  async getAllLessons(query: LessonsQuery = {}) {
    const {
      sort = LessonSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const conditions = this.getFiltersConditions(filters);

    if (query.currentUserRole === USER_ROLES.teacher && query.currentUserId) {
      conditions.push(eq(lessons.authorId, query.currentUserId));
    }

    const sortOrderQuery = sortOrder(this.getColumnToSortBy(sortedField as LessonSortField));

    const lessonsData = await this.adminLessonsRepository.getLessons(conditions, sortOrderQuery);

    const [{ totalItems }] = await this.adminLessonsRepository.getLessonsCount(conditions);

    const lessonsWithSignedUrls = await Promise.all(
      lessonsData.map(async (lesson) => {
        if (!lesson.imageUrl) {
          return lesson;
        }

        return {
          ...lesson,
          imageUrl: lesson.imageUrl.startsWith("https://")
            ? lesson.imageUrl
            : await this.filesService.getFileUrl(lesson.imageUrl),
        };
      }),
    );

    return {
      data: lessonsWithSignedUrls,
      pagination: {
        totalItems,
        page,
        perPage,
      },
    };
  }
  async processLessonItems(lessonItemsList: LessonItemWithContentSchema[]) {
    const getFileUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.filesService.getFileUrl(url);
    };
    return await Promise.all(
      lessonItemsList.map(async (item) => {
        const content = await match(item)
          .returnType<Promise<LessonItemResponse["content"]>>()
          .with({ lessonItemType: "question", questionData: P.not(P.nullish) }, async (item) => {
            const questionAnswers = await this.adminLessonsRepository.getQuestionAnswers(
              item.questionData.id,
            );

            return {
              id: item.questionData.id,
              questionType: item.questionData.questionType,
              questionBody: item.questionData.questionBody,
              questionAnswers,
              state: item.questionData.state,
            };
          })
          .with(
            { lessonItemType: "text_block", textBlockData: P.not(P.nullish) },
            async (item) => ({
              id: item.textBlockData.id,
              body: item.textBlockData.body || "",
              state: item.textBlockData.state || "draft",
              title: item.textBlockData.title,
            }),
          )
          .with({ lessonItemType: "file", fileData: P.not(P.nullish) }, async (item) => ({
            id: item.fileData.id,
            title: item.fileData.title,
            type: item.fileData.type,
            url: (await getFileUrl(item.fileData.url)) as string,
            state: item.fileData.state,
            body: item.fileData.body,
          }))
          .otherwise(() => {
            throw new Error(`Unknown item type: ${item.lessonItemType}`);
          });

        return {
          lessonItemId: item.lessonItemId,
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );
  }

  async getLessonWithItemsById(id: string) {
    const lesson = await this.adminLessonsRepository.getLessonById(id);

    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessonItemsList = await this.adminLessonsRepository.getLessonItems(id);

    const items = await this.processLessonItems(lessonItemsList as LessonItemWithContentSchema[]);

    return {
      ...lesson,
      lessonItems: items,
      itemsCount: items.length,
    };
  }

  async getAvailableLessons(courseId: UUIDType) {
    const availableLessons = await this.adminLessonsRepository.getAvailableLessons(courseId);

    if (isEmpty(availableLessons)) throw new NotFoundException("Lessons not found");

    return await Promise.all(
      availableLessons.map(async (lesson) => {
        if (!lesson.imageUrl) {
          return lesson;
        }

        const imageUrl = lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.filesService.getFileUrl(lesson.imageUrl);
        return { ...lesson, imageUrl };
      }),
    );
  }

  async createLesson(body: CreateLessonBody, authorId: string) {
    const [lesson] = await this.adminLessonsRepository.createLesson(body, authorId);

    if (!lesson) throw new NotFoundException("Lesson not found");

    return { id: lesson.id };
  }

  async createLessonAndAddToCourse(
    body: CreateLessonBody & { courseId?: string },
    authorId: string,
  ) {
    return await this.db.transaction(async (tx) => {
      const [lesson] = await tx
        .insert(lessons)
        .values({ ...body, authorId })
        .returning();

      if (!lesson) throw new NotFoundException("Lesson not found");

      if (body.courseId) {
        const existingLessons = await tx
          .select()
          .from(courseLessons)
          .where(eq(courseLessons.courseId, body.courseId))
          .orderBy(courseLessons.displayOrder);

        const newLessonDisplayOrder = (existingLessons.length > 0 ? existingLessons.length : 0) + 1;

        await tx.insert(courseLessons).values({
          courseId: body.courseId,
          lessonId: lesson.id,
          displayOrder: newLessonDisplayOrder,
        });
      }

      return { id: lesson.id };
    });
  }

  async updateLesson(id: string, body: UpdateLessonBody) {
    const [lesson] = await this.adminLessonsRepository.updateLesson(id, body);

    if (!lesson) throw new NotFoundException("Lesson not found");
  }

  async toggleLessonAsFree(courseId: UUIDType, lessonId: UUIDType, isFree: boolean) {
    return await this.adminLessonsRepository.toggleLessonAsFree(courseId, lessonId, isFree);
  }

  async addLessonToCourse(courseId: string, lessonId: string, displayOrder?: number) {
    try {
      if (displayOrder === undefined) {
        const maxOrderResult =
          await this.adminLessonsRepository.getMaxOrderLessonsInCourse(courseId);

        displayOrder = maxOrderResult + 1;
      }

      await this.adminLessonsRepository.assignLessonToCourse(courseId, lessonId, displayOrder);
    } catch (error) {
      if (error.code === "23505") {
        // postgres uniq error code
        throw new ConflictException("This lesson is already added to the course");
      }
      throw error;
    }
  }

  async removeLessonFromCourse(courseId: string, lessonId: string) {
    const result = await this.adminLessonsRepository.removeCourseLesson(courseId, lessonId);

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.adminLessonsRepository.updateDisplayOrderLessonsInCourse(courseId, lessonId);
  }

  async removeChapter(courseId: string, chapterId: string) {
    const lessonItemsList = await this.adminLessonsRepository.getBetaLessons(chapterId);

    const result = await this.adminLessonsRepository.removeChapterAndReferences(
      chapterId,
      lessonItemsList as LessonItemWithContentSchema[],
    );

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.adminLessonsRepository.updateChapterDisplayOrder(courseId, chapterId);
  }

  private getFiltersConditions(filters: LessonsFilterSchema) {
    const conditions = [];

    if (filters.title) {
      conditions.push(ilike(lessons.title, `%${filters.title.toLowerCase()}%`));
    }
    if (filters.state) {
      conditions.push(eq(lessons.state, filters.state));
    }
    if (filters.archived) {
      conditions.push(eq(lessons.archived, filters.archived));
    }

    return conditions ?? undefined;
  }

  private getColumnToSortBy(sort: LessonSortField) {
    switch (sort) {
      case LessonSortFields.createdAt:
        return lessons.createdAt;
      case LessonSortFields.state:
        return lessons.state;
      case LessonSortFields.itemsCount:
        return sql<number>`COUNT(DISTINCT ${lessonItems.id})`;
      default:
        return lessons.title;
    }
  }
}
