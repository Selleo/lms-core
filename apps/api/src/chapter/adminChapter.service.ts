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

  async removeChapter(chapterId: UUIDType) {
    const [chapter] = await this.adminChapterRepository.getChapterById(chapterId);

    if (!chapter) throw new NotFoundException("Chapter not found");

    await this.db.transaction(async (trx) => {
      await this.adminChapterRepository.removeChapter(chapterId, trx);
      await this.adminChapterRepository.updateChapterDisplayOrder(chapter.courseId, trx);
    });
  }
}
