import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { FileService } from "src/file/file.service";
import { chapters } from "src/storage/schema";

import { AdminChapterRepository } from "./repositories/adminChapter.repository";

import type { CreateChapterBody, UpdateChapterBody } from "./schemas/chapter.schema";
import type { UUIDType } from "src/common";

@Injectable()
export class AdminChapterService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly fileService: FileService,
    private readonly adminChapterRepository: AdminChapterRepository,
  ) {}

  // async getAllLessons(query: LessonsQuery = {}) {
  //   const {
  //     sort = LessonSortFields.title,
  //     perPage = DEFAULT_PAGE_SIZE,
  //     page = 1,
  //     filters = {},
  //   } = query;

  //   const { sortOrder, sortedField } = getSortOptions(sort);
  //   const conditions = this.getFiltersConditions(filters);

  //   if (query.currentUserRole === USER_ROLES.TEACHER && query.currentUserId) {
  //     conditions.push(eq(lessons.authorId, query.currentUserId));
  //   }

  //   const sortOrderQuery = sortOrder(this.getColumnToSortBy(sortedField as LessonSortField));

  //   const lessonsData = await this.adminChapterRepository.getLessons(conditions, sortOrderQuery);

  //   const [{ totalItems }] = await this.adminChapterRepository.getLessonsCount(conditions);

  //   const lessonsWithSignedUrls = await Promise.all(
  //     lessonsData.map(async (lesson) => {
  //       if (!lesson.imageUrl) {
  //         return lesson;
  //       }

  //       return {
  //         ...lesson,
  //         imageUrl: lesson.imageUrl.startsWith("https://")
  //           ? lesson.imageUrl
  //           : await this.fileService.getFileUrl(lesson.imageUrl),
  //       };
  //     }),
  //   );

  //   return {
  //     data: lessonsWithSignedUrls,
  //     pagination: {
  //       totalItems,
  //       page,
  //       perPage,
  //     },
  //   };
  // }
  // async processLessonItems(lessonItemsList: AdminLessonWithContentSchema[]) {
  //   const getFileUrl = async (url: string) => {
  //     if (!url || url.startsWith("https://")) return url;
  //     return await this.s3Service.getSignedUrl(url);
  //   };
  //   return await Promise.all(
  //     lessonItemsList.map(async (item) => {
  //       const content = await match(item)
  //         .returnType<Promise<LessonItemResponse["content"]>>()
  //         .with({ lessonItemType: "question", questionData: P.not(P.nullish) }, async (item) => {
  //           const questionAnswers = await this.adminChapterRepository.getQuestionAnswers(
  //             item.questionData.id,
  //           );

  //           return {
  //             id: item.questionData.id,
  //             questionType: item.questionData.questionType,
  //             questionBody: item.questionData.questionBody,
  //             questionAnswers,
  //             state: item.questionData.state,
  //           };
  //         })
  //         .with(
  //           { lessonItemType: "text_block", textBlockData: P.not(P.nullish) },
  //           async (item) => ({
  //             id: item.textBlockData.id,
  //             body: item.textBlockData.body || "",
  //             state: item.textBlockData.state || "draft",
  //             title: item.textBlockData.title,
  //           }),
  //         )
  //         .with({ lessonItemType: "file", fileData: P.not(P.nullish) }, async (item) => ({
  //           id: item.fileData.id,
  //           title: item.fileData.title,
  //           type: item.fileData.type,
  //           url: (await getFileUrl(item.fileData.url)) as string,
  //           state: item.fileData.state,
  //           body: item.fileData.body,
  //         }))
  //         .otherwise(() => {
  //           throw new Error(`Unknown item type: ${item.lessonItemType}`);
  //         });

  //       return {
  //         lessonItemId: item.lessonItemId,
  //         lessonItemType: item.lessonItemType,
  //         displayOrder: item.displayOrder,
  //         content,
  //       };
  //     }),
  //   );
  // }

  // async getLessonWithItemsById(id: string) {
  //   const lesson = await this.adminChapterRepository.getLessonById(id);

  //   if (!lesson) throw new NotFoundException("Lesson not found");

  //   const lessonItemsList = await this.adminChapterRepository.getLessonItems(id);

  //   const items = await this.processLessonItems(lessonItemsList as AdminLessonWithContentSchema[]);

  //   return {
  //     ...lesson,
  //     lessonItems: items,
  //     itemsCount: items.length,
  //   };
  // }

  // async getAvailableLessons(courseId: UUIDType) {
  //   const availableLessons = await this.adminChapterRepository.getAvailableLessons(courseId);

  //   if (isEmpty(availableLessons)) throw new NotFoundException("Lessons not found");

  //   return await Promise.all(
  //     availableLessons.map(async (lesson) => {
  //       if (!lesson.imageUrl) {
  //         return lesson;
  //       }

  //       const imageUrl = lesson.imageUrl.startsWith("https://")
  //         ? lesson.imageUrl
  //         : await this.fileService.getFileUrl(lesson.imageUrl);
  //       return { ...lesson, imageUrl };
  //     }),
  //   );
  // }

  // async createLesson(body: CreateLessonBody, authorId: string) {
  //   const [lesson] = await this.adminChapterRepository.createLesson(body, authorId);

  //   if (!lesson) throw new NotFoundException("Lesson not found");

  //   return { id: lesson.id };
  // }

  // TODO: to remove - duplicated above
  // async createChapterForCourse(
  //   body: CreateLessonBody & { courseId?: string },
  //   authorId: string,
  // ) {
  //   return await this.db.transaction(async (trx) => {
  //     const [lesson] = await tx
  //       .insert(lessons)
  //       .values({ ...body, authorId })
  //       .returning();

  //     if (!lesson) throw new NotFoundException("Lesson not found");

  //     if (body.courseId) {
  //       const existingLessons = await tx
  //         .select()
  //         .from(courseLessons)
  //         .where(eq(courseLessons.courseId, body.courseId))
  //         .orderBy(courseLessons.displayOrder);

  //       const newLessonDisplayOrder = (existingLessons.length > 0 ? existingLessons.length : 0) + 1;

  //       await tx.insert(courseLessons).values({
  //         courseId: body.courseId,
  //         lessonId: lesson.id,
  //         displayOrder: newLessonDisplayOrder,
  //       });
  //     }

  //     return { id: lesson.id };
  //   });
  // }

  async createChapterForCourse(body: CreateChapterBody, authorId: UUIDType) {
    return await this.db.transaction(async (trx) => {
      const [maxDisplayOrder] = await trx
        .select({ displayOrder: sql<number>`COALESCE(MAX(${chapters.displayOrder}), 0)` })
        .from(chapters)
        .where(eq(chapters.courseId, body.courseId));

      const [chapter] = await trx
        .insert(chapters)
        .values({ ...body, authorId, displayOrder: maxDisplayOrder.displayOrder + 1 })
        .returning();

      if (!chapter) throw new NotFoundException("Lesson not found");

      return { id: chapter.id };
    });
  }

  async updateFreemiumStatus(chapterId: UUIDType, isFreemium: boolean) {
    return await this.adminChapterRepository.updateFreemiumStatus(chapterId, isFreemium);
  }

  async updateChapterDisplayOrder(chapterObject: {
    chapterId: UUIDType;
    displayOrder: number;
  }): Promise<void> {
    const [chapterToUpdate] = await this.adminChapterRepository.getChapterById(
      chapterObject.chapterId,
    );

    const oldDisplayOrder = chapterToUpdate.displayOrder;

    if (!chapterToUpdate || oldDisplayOrder === null) {
      throw new NotFoundException("Chapter not found");
    }

    const newDisplayOrder = chapterObject.displayOrder;

    await this.adminChapterRepository.changeChapterDisplayOrder(
      chapterToUpdate.courseId,
      chapterToUpdate.id,
      oldDisplayOrder,
      newDisplayOrder,
    );
  }

  async updateChapter(id: string, body: UpdateChapterBody) {
    const [chapter] = await this.adminChapterRepository.updateChapter(id, body);

    if (!chapter) throw new NotFoundException("Lesson not found");
  }

  // async toggleLessonAsFree(courseId: UUIDType, lessonId: UUIDType, isFree: boolean) {
  //   return await this.adminChapterRepository.toggleLessonAsFree(courseId, lessonId, isFree);
  // }

  // async removeLessonFromCourse(courseId: string, lessonId: string) {
  //   const result = await this.adminChapterRepository.removeCourseLesson(courseId, lessonId);

  //   if (result.length === 0) {
  //     throw new NotFoundException("Lesson not found in this course");
  //   }

  //   await this.adminChapterRepository.updateDisplayOrderLessonsInCourse(courseId, lessonId);
  // }

  async removeChapter(chapterId: UUIDType) {
    const [chapter] = await this.adminChapterRepository.getChapterById(chapterId);

    if (!chapter) throw new NotFoundException("Chapter not found");

    await this.db.transaction(async (trx) => {
      await this.adminChapterRepository.removeChapter(chapterId, trx);
      await this.adminChapterRepository.updateChapterDisplayOrder(chapter.courseId, trx);
    });
  }

  // private getFiltersConditions(filters: LessonsFilterSchema) {
  //   const conditions = [];

  //   if (filters.title) {
  //     conditions.push(ilike(lessons.title, `%${filters.title.toLowerCase()}%`));
  //   }
  //   if (filters.state) {
  //     conditions.push(eq(lessons.state, filters.state));
  //   }
  //   if (filters.archived) {
  //     conditions.push(eq(lessons.archived, filters.archived));
  //   }

  //   return conditions ?? undefined;
  // }

  // private getColumnToSortBy(sort: LessonSortField) {
  //   switch (sort) {
  //     case LessonSortFields.createdAt:
  //       return lessons.createdAt;
  //     case LessonSortFields.state:
  //       return lessons.state;
  //     case LessonSortFields.itemsCount:
  //       return sql<number>`COUNT(DISTINCT ${lessonItems.id})`;
  //     default:
  //       return lessons.title;
  //   }
  // }
}
