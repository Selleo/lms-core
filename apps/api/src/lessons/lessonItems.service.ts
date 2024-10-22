import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq, isNotNull } from "drizzle-orm";
import type { DatabasePg, UUIDType } from "src/common";
import { S3Service } from "src/file/s3.service";
import {
  files,
  lessonItems,
  lessons,
  questions,
  textBlocks,
} from "src/storage/schema";
import type {
  FileInsertType,
  FileSelectType,
  QuestionInsertType,
  QuestionSelectType,
  TextBlockInsertType,
  TextBlockSelectType,
  UpdateFileBody,
  UpdateQuestionBody,
  UpdateTextBlockBody,
} from "./schemas/lessonItem.schema";

type LessonItemType = "text_block" | "file" | "question";

@Injectable()
export class LessonItemsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async getAllLessonItems(type?: "text_block" | "question" | "file") {
    let questionItems: QuestionSelectType[] = [];
    let textItems: TextBlockSelectType[] = [];
    let fileItems: FileSelectType[] = [];

    if (!type || type === "question") {
      questionItems = await this.db.select().from(questions);
    }
    if (!type || type === "text_block") {
      textItems = await this.db.select().from(textBlocks);
    }
    if (!type || type === "file") {
      fileItems = await this.db.select().from(files);
    }

    const allItems = [
      ...questionItems.map((item) => ({
        ...item,
        itemType: "question" as const,
      })),
      ...textItems.map((item) => ({
        ...item,
        itemType: "text_block" as const,
      })),
      ...fileItems.map((item) => ({ ...item, itemType: "file" as const })),
    ];

    return allItems;
  }

  async getAvailableLessonItems() {
    const questionItems = await this.db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.state, "published"),
          eq(questions.archived, false),
          isNotNull(questions.id),
        ),
      );
    const textItems = await this.db
      .select()
      .from(textBlocks)
      .where(
        and(
          eq(textBlocks.state, "published"),
          eq(textBlocks.archived, false),
          isNotNull(textBlocks.id),
          isNotNull(textBlocks.title),
          isNotNull(textBlocks.body),
        ),
      );
    const fileItems = await this.db
      .select()
      .from(files)
      .where(
        and(
          eq(files.state, "published"),
          eq(files.archived, false),
          isNotNull(files.id),
          isNotNull(files.title),
        ),
      );

    const allItems = [
      ...questionItems.map((item) => ({
        ...item,
        itemType: "question" as const,
      })),
      ...textItems.map((item) => ({
        ...item,
        itemType: "text_block" as const,
      })),
      ...fileItems.map((item) => ({ ...item, itemType: "file" as const })),
    ];

    return allItems;
  }

  async getLessonItemById(id: UUIDType) {
    const [textBlock, question, file] = await Promise.all([
      this.db.select().from(textBlocks).where(eq(textBlocks.id, id)).limit(1),
      this.db.select().from(questions).where(eq(questions.id, id)).limit(1),
      this.db.select().from(files).where(eq(files.id, id)).limit(1),
    ]);

    if (textBlock.length > 0) {
      return { ...textBlock[0], itemType: "text_block" as const };
    }

    if (question.length > 0) {
      return { ...question[0], itemType: "question" as const };
    }

    if (file.length > 0) {
      return { ...file[0], itemType: "file" as const };
    }

    throw new NotFoundException("Lesson item not found");
  }

  async assignItemsToLesson(
    lessonId: string,
    items: Array<{ id: string; type: LessonItemType; displayOrder: number }>,
  ): Promise<void> {
    const [lesson] = await this.db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    if (!lesson) {
      throw new NotFoundException("Lekcja nie została znaleziona");
    }

    await this.verifyItems(items);

    await this.db.transaction(async (tx) => {
      for (const item of items) {
        await tx.insert(lessonItems).values({
          lessonId,
          lessonItemId: item.id,
          lessonItemType: item.type,
          displayOrder: item.displayOrder,
        });
      }
    });
  }

  async unassignItemsFromLesson(
    lessonId: string,
    items: Array<{ id: string; type: LessonItemType }>,
  ): Promise<void> {
    const [lesson] = await this.db
      .select({ id: lessons.id })
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    await this.db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .delete(lessonItems)
          .where(
            and(
              eq(lessonItems.lessonId, lessonId),
              eq(lessonItems.lessonItemId, item.id),
            ),
          );
      }
    });
  }

  async updateTextBlockItem(id: UUIDType, body: UpdateTextBlockBody) {
    const [existingTextBlock] = await this.db
      .select()
      .from(textBlocks)
      .where(eq(textBlocks.id, id));

    if (!existingTextBlock) {
      throw new NotFoundException("Text block not found");
    }

    const [updatedTextBlock] = await this.db
      .update(textBlocks)
      .set({
        title: body.title,
        body: body.body,
        state: body.state,
        archived: body.archived,
      })
      .where(eq(textBlocks.id, id))
      .returning();

    return updatedTextBlock;
  }

  async updateQuestionItem(id: UUIDType, body: UpdateQuestionBody) {
    const [question] = await this.db
      .update(questions)
      .set({
        questionType: body.questionType,
        questionBody: body.questionBody,
        solutionExplanation: body.solutionExplanation,
        state: body.state,
      })
      .where(eq(questions.id, id))
      .returning();

    if (!question) throw new NotFoundException("Question not found");
  }

  async updateFileItem(id: UUIDType, body: UpdateFileBody) {
    const [file] = await this.db
      .update(files)
      .set({
        title: body.title,
        type: body.type,
        url: body.url,
        state: body.state,
      })
      .where(eq(files.id, id))
      .returning();

    if (!file) throw new NotFoundException("File not found");
  }

  async createTextBlock(content: TextBlockInsertType, userId: UUIDType) {
    const [textBlock] = await this.db
      .insert(textBlocks)
      .values({
        title: content.title,
        body: content.body,
        state: content.state,
        authorId: userId,
      })
      .returning();

    if (!textBlock) throw new NotFoundException("Text block not found");

    return textBlock;
  }

  async createQuestion(content: QuestionInsertType, userId: UUIDType) {
    const [question] = await this.db
      .insert(questions)
      .values({
        questionType: content.questionType,
        questionBody: content.questionBody,
        solutionExplanation: content.solutionExplanation,
        state: content.state,
        authorId: userId,
      })
      .returning();

    if (!question) throw new NotFoundException("Question not found");

    return question;
  }

  async createFile(content: FileInsertType, userId: UUIDType) {
    const [file] = await this.db
      .insert(files)
      .values({
        title: content.title,
        type: content.type,
        url: content.url,
        state: content.state,
        authorId: userId,
      })
      .returning();

    if (!file) throw new NotFoundException("File not found");

    return file;
  }

  private async verifyItems(
    items: Array<{ id: string; type: LessonItemType; displayOrder: number }>,
  ): Promise<void> {
    for (const item of items) {
      let result;
      switch (item.type) {
        case "text_block":
          result = await this.db
            .select({ id: textBlocks.id })
            .from(textBlocks)
            .where(eq(textBlocks.id, item.id))
            .limit(1);
          break;
        case "file":
          result = await this.db
            .select({ id: files.id })
            .from(files)
            .where(eq(files.id, item.id))
            .limit(1);
          break;
        case "question":
          result = await this.db
            .select({ id: questions.id })
            .from(questions)
            .where(eq(questions.id, item.id))
            .limit(1);
          break;
      }
      if (result.length === 0) {
        throw new BadRequestException(
          `Element ${item.id} typu ${item.type} nie został znaleziony`,
        );
      }
    }
  }
}
