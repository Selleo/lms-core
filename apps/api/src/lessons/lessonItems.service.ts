import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { DatabasePg, UUIDType } from "src/common";
import { S3Service } from "src/file/s3.service";
import { files, questions, textBlocks } from "src/storage/schema";
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

@Injectable()
export class LessonItemsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async getAllLessonItems(type?: "text-block" | "question" | "file") {
    let questionItems: QuestionSelectType[] = [];
    let textItems: TextBlockSelectType[] = [];
    let fileItems: FileSelectType[] = [];

    if (!type || type === "question") {
      questionItems = await this.db.select().from(questions);
    }
    if (!type || type === "text-block") {
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
        itemType: "text-block" as const,
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
      return { ...textBlock[0], itemType: "text-block" as const };
    }

    if (question.length > 0) {
      return { ...question[0], itemType: "question" as const };
    }

    if (file.length > 0) {
      return { ...file[0], itemType: "file" as const };
    }

    throw new NotFoundException("Lesson item not found");
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

  // async createLessonItem(
  //   lessonItemType: LessonItemType,
  //   content: LessonItemResponse["content"],
  // ) {
  //   const [lessonItem] = await this.db
  //     .insert(lessonItems)
  //     .values({
  //       lessonId: content.lessonId,
  //       lessonItemId: content.id,
  //       lessonItemType,
  //       displayOrder: content.displayOrder,
  //     })
  //     .returning();

  //   if (!lessonItem) throw new NotFoundException("Lesson item not found");

  //   return lessonItem;
  // }

  // private isValidItem(item: any): boolean {
  //   switch (item.lessonItemType) {
  //     case "question":
  //       return !!item.questionData;
  //     case "text_block":
  //       return !!item.textBlockData;
  //     case "file":
  //       return !!item.fileData;
  //     default:
  //       return false;
  //   }
  // }
}
