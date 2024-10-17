import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import type { DatabasePg } from "src/common";
import { S3Service } from "src/file/s3.service";
import {
  courseLessons,
  files,
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentCompletedLessonItems,
  studentCourses,
  studentQuestionAnswers,
  textBlocks,
} from "src/storage/schema";
import { match, P } from "ts-pattern";
import type { LessonItemResponse } from "./schemas/lessonItem.schema";
import { isEmpty } from "lodash";

@Injectable()
export class LessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
  ) {}

  async getAllLessons() {
    const lessonsData = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        state: lessons.state,
        archived: lessons.archived,
        itemsCount: sql<number>`CAST(COUNT(DISTINCT ${lessonItems.id}) AS INTEGER)`,
      })
      .from(lessons)
      .leftJoin(lessonItems, eq(lessonItems.lessonId, lessons.id))
      .groupBy(lessons.id);

    return Promise.all(
      lessonsData.map(async (lesson) => ({
        ...lesson,
        imageUrl: lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl),
      })),
    );
  }

  async getLesson(id: string, userId: string, isAdmin?: boolean) {
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
      .where(
        and(
          eq(lessons.archived, false),
          eq(lessons.id, id),
          eq(lessons.state, "published"),
        ),
      );

    if (!isAdmin) {
      if (!accessCourseLessons)
        throw new UnauthorizedException("You don't have access to this lesson");
    }

    const [lesson] = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
      })
      .from(lessons)
      .where(
        and(
          eq(lessons.id, id),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
        ),
      );

    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessonItemsList = await this.db
      .select({
        id: lessonItems.id,
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
          eq(questions.state, "published"),
        ),
      )
      .leftJoin(
        textBlocks,
        and(
          eq(lessonItems.lessonItemId, textBlocks.id),
          eq(lessonItems.lessonItemType, "text_block"),
          eq(textBlocks.state, "published"),
        ),
      )
      .leftJoin(
        files,
        and(
          eq(lessonItems.lessonItemId, files.id),
          eq(lessonItems.lessonItemType, "file"),
          eq(files.state, "published"),
        ),
      )
      .where(eq(lessonItems.lessonId, id))
      .orderBy(lessonItems.displayOrder);

    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    const items = await Promise.all(
      validLessonItemsList.map(async (item) => {
        const content = await match(item)
          .returnType<Promise<LessonItemResponse["content"]>>()
          .with(
            { lessonItemType: "question", questionData: P.not(P.nullish) },
            async (item) => {
              const questionAnswers = await this.db
                .select({
                  id: questionAnswerOptions.id,
                  optionText: questionAnswerOptions.optionText,
                  position: questionAnswerOptions.position,
                  isStudentAnswer: sql<boolean>`
                  CASE
                    WHEN ${studentQuestionAnswers.id} IS NOT NULL AND
                      EXISTS (
                        SELECT 1
                        FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
                        WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(${questionAnswerOptions.optionText})
                      )
                    THEN true
                    ELSE false
                  END
              `,
                })
                .from(questionAnswerOptions)
                .leftJoin(
                  studentQuestionAnswers,
                  and(
                    eq(
                      studentQuestionAnswers.questionId,
                      questionAnswerOptions.questionId,
                    ),
                    eq(studentQuestionAnswers.studentId, userId),
                  ),
                )
                .where(
                  eq(questionAnswerOptions.questionId, item.questionData.id),
                )
                .groupBy(
                  questionAnswerOptions.id,
                  questionAnswerOptions.optionText,
                  questionAnswerOptions.position,
                  studentQuestionAnswers.id,
                  studentQuestionAnswers.answer,
                );
              if (item.questionData.questionType !== "open_answer") {
                return {
                  id: item.questionData.id,
                  questionType: item.questionData.questionType,
                  questionBody: item.questionData.questionBody,
                  questionAnswers,
                };
              }
              const studentAnswer = await this.db
                .select({
                  id: studentQuestionAnswers.id,
                  optionText: sql<string>`${studentQuestionAnswers.answer}->'answer_1'`,
                  isStudentAnswer: sql<boolean>`true`,
                  position: sql<number>`1`,
                })
                .from(studentQuestionAnswers)
                .where(
                  eq(studentQuestionAnswers.questionId, item.questionData.id),
                )
                .limit(1);

              return {
                id: item.questionData.id,
                questionType: item.questionData.questionType,
                questionBody: item.questionData.questionBody,
                questionAnswers: studentAnswer,
              };
            },
          )
          .with(
            { lessonItemType: "text_block", textBlockData: P.not(P.nullish) },
            async (item) => ({
              id: item.textBlockData.id,
              body: item.textBlockData.body || "",
              state: item.textBlockData.state,
              title: item.textBlockData.title,
            }),
          )
          .with(
            { lessonItemType: "file", fileData: P.not(P.nullish) },
            async (item) => ({
              id: item.fileData.id,
              title: item.fileData.title,
              type: item.fileData.type,
              url: (item.fileData.url as string).startsWith("https://")
                ? item.fileData.url
                : await this.s3Service.getSignedUrl(item.fileData.url),
            }),
          )
          .otherwise(() => {
            throw new Error(`Unknown item type: ${item.lessonItemType}`);
          });

        return {
          id: item.id,
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );

    const imageUrl = (lesson.imageUrl as string).startsWith("https://")
      ? lesson.imageUrl
      : await this.s3Service.getSignedUrl(lesson.imageUrl);

    const completedLessonItems = await this.db
      .selectDistinct({
        lessonItemId: studentCompletedLessonItems.lessonItemId,
      })
      .from(studentCompletedLessonItems)
      .where(eq(studentCompletedLessonItems.lessonId, lesson.id));

    const completableLessonItems = items.filter(
      (item) => item.lessonItemType !== "text_block",
    );

    return {
      ...lesson,
      imageUrl,
      lessonItems: items,
      itemsCount: completableLessonItems.length,
      itemsCompletedCount: completedLessonItems.length,
    };
  }

  async getAvailableLessons() {
    const availableLessons = await this.db
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
      .from(lessons)
      .where(
        and(
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
          isNotNull(lessons.id),
          isNotNull(lessons.title),
          isNotNull(lessons.description),
          isNotNull(lessons.imageUrl),
        ),
      );

    if (isEmpty(availableLessons))
      throw new NotFoundException("No lessons found");

    const lessonsWithSignedUrls = await Promise.all(
      availableLessons.map(async (lesson) => {
        const imageUrl = lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl);
        return { ...lesson, imageUrl };
      }),
    );

    return lessonsWithSignedUrls;
  }

  async addLessonToCourse(
    courseId: string,
    lessonId: string,
    displayOrder?: number,
  ) {
    try {
      if (displayOrder === undefined) {
        const [maxOrderResult] = await this.db
          .select({ maxOrder: sql<number>`MAX(${courseLessons.displayOrder})` })
          .from(courseLessons)
          .where(eq(courseLessons.courseId, courseId));

        displayOrder = (maxOrderResult?.maxOrder ?? 0) + 1;
      }

      await this.db.insert(courseLessons).values({
        courseId,
        lessonId,
        displayOrder,
      });
    } catch (error) {
      if (error.code === "23505") {
        // postgres uniq error code
        throw new ConflictException(
          "This lesson is already added to the course",
        );
      }
      throw error;
    }
  }

  async removeLessonFromCourse(courseId: string, lessonId: string) {
    const result = await this.db
      .delete(courseLessons)
      .where(
        and(
          eq(courseLessons.courseId, courseId),
          eq(courseLessons.lessonId, lessonId),
        ),
      )
      .returning();

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.db.execute(sql`
      UPDATE ${courseLessons}
      SET display_order = display_order - 1
      WHERE course_id = ${courseId}
        AND display_order > (
          SELECT display_order
          FROM ${courseLessons}
          WHERE course_id = ${courseId}
            AND lesson_id = ${lessonId}
        )
    `);
  }

  private isValidItem(item: any): boolean {
    switch (item.lessonItemType) {
      case "question":
        return !!item.questionData;
      case "text_block":
        return !!item.textBlockData;
      case "file":
        return !!item.fileData;
      default:
        return false;
    }
  }
}
