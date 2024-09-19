import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { DatabasePg } from "src/common";
import {
  courseLessons,
  files,
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentCourses,
  textBlocks,
} from "src/storage/schema";
import { LessonItemResponse } from "./schemas/lessonItem.schema";

@Injectable()
export class LessonsService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getLesson(id: string, userId: string) {
    const [accessCourseLessons] = await this.db
      .select({
        id: lessons.id,
        studentCourseId: studentCourses.id,
      })
      .from(lessons)
      .leftJoin(courseLessons, eq(courseLessons.id, lessons.id))
      .leftJoin(
        studentCourses,
        and(
          eq(studentCourses.courseId, courseLessons.id),
          eq(studentCourses.studentId, userId),
        ),
      )
      .where(eq(lessons.archived, false));

    if (!accessCourseLessons)
      throw new UnauthorizedException("You don't have access to this lesson");

    const [lesson] = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
      })
      .from(lessons)
      .where(and(eq(lessons.id, id), eq(lessons.archived, false)));

    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessonItemsList = await this.db
      .select({
        lessonItemType: lessonItems.lessonItemType,
        questionData: questions,
        textBlockData: textBlocks,
        fileData: files,
        displayOrder: lessonItems.displayOrder,
      })
      .from(lessonItems)
      .leftJoin(
        questions,
        and(
          eq(lessonItems.lessonItemId, questions.id),
          eq(lessonItems.lessonItemType, "question"),
        ),
      )
      .leftJoin(
        textBlocks,
        and(
          eq(lessonItems.lessonItemId, textBlocks.id),
          eq(lessonItems.lessonItemType, "text_block"),
        ),
      )
      .leftJoin(
        files,
        and(
          eq(lessonItems.lessonItemId, files.id),
          eq(lessonItems.lessonItemType, "file"),
        ),
      )
      .where(eq(lessonItems.lessonId, id))
      .orderBy(lessonItems.displayOrder);

    const items = await Promise.all(
      lessonItemsList.map(async (item) => {
        let content: LessonItemResponse["content"];
        switch (item.lessonItemType) {
          case "question":
            if (!item.questionData) throw new Error("Question data is missing");
            const questionAnswers = await this.db
              .select({
                id: questionAnswerOptions.id,
                optionText: questionAnswerOptions.optionText,
                position: questionAnswerOptions.position,
              })
              .from(questionAnswerOptions)
              .where(
                eq(questionAnswerOptions.questionId, item.questionData.id),
              );

            content = {
              id: item.questionData.id,
              questionType: item.questionData.questionType,
              questionBody: item.questionData.questionBody,
              questionAnswers,
            };
            break;
          case "text_block":
            if (!item.textBlockData)
              throw new Error("Text block data is missing");
            content = {
              id: item.textBlockData.id,
              body: item.textBlockData.body || "",
              state: item.textBlockData.state,
            };
            break;
          case "file":
            if (!item.fileData) throw new Error("File data is missing");
            content = {
              id: item.fileData.id,
              title: item.fileData.title,
              type: item.fileData.type,
              url: item.fileData.url,
            };
            break;
          default:
            throw new Error(`Unknown item type: ${item.lessonItemType}`);
        }

        return {
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );

    return { ...lesson, lessonItems: items };
  }
}
