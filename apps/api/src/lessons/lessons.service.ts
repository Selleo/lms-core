import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { and, count, eq, inArray, isNotNull, sql } from "drizzle-orm";
import type { DatabasePg, UUIDType } from "src/common";
import {
  courseLessons,
  files,
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentCompletedLessonItems,
  studentCourses,
  studentLessonsProgress,
  studentQuestionAnswers,
  textBlocks,
} from "src/storage/schema";
import { match, P } from "ts-pattern";
import {
  LessonItemResponse,
  LessonItemWithContentSchema,
  QuestionWithContent,
} from "./schemas/lessonItem.schema";
import { isEmpty, isNull } from "lodash";
import { Lesson } from "./schemas/lesson.schema";
import { S3Service } from "src/file/s3.service";

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
    const [accessCourseLessons] = await this.checkLessonAssignment(id, userId);

    if (!isAdmin && !accessCourseLessons)
      throw new UnauthorizedException("You don't have access to this lesson");

    const [lesson] = await this.db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        imageUrl: sql<string>`${lessons.imageUrl}`,
        type: sql<string>`${lessons.type}`,
        isSubmitted: sql<boolean>`(${studentLessonsProgress.quizCompleted})`,
      })
      .from(lessons)
      .leftJoin(
        studentLessonsProgress,
        and(
          eq(studentLessonsProgress.lessonId, id),
          eq(studentLessonsProgress.studentId, userId),
        ),
      )
      .where(
        and(
          eq(lessons.id, id),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
        ),
      );

    if (!lesson) throw new NotFoundException("Lesson not found");

    const imageUrl = (lesson.imageUrl as string).startsWith("https://")
      ? lesson.imageUrl
      : await this.s3Service.getSignedUrl(lesson.imageUrl);

    const completedLessonItems = await this.db
      .selectDistinct({
        lessonItemId: studentCompletedLessonItems.lessonItemId,
      })
      .from(studentCompletedLessonItems)
      .where(eq(studentCompletedLessonItems.lessonId, lesson.id));

    if (lesson.type !== "quiz") {
      const lessonItems = await this.getLessonItems(lesson, userId);

      const completableLessonItems = lessonItems.filter(
        (item) => item.lessonItemType !== "text_block",
      );
      return {
        ...lesson,
        imageUrl,
        lessonItems: lessonItems,
        itemsCount: completableLessonItems.length,
        itemsCompletedCount: completedLessonItems.length,
      };
    }

    const [lessonProgress] = await this.db
      .select({
        quizCompleted: sql<boolean>`
          CASE
            WHEN ${studentLessonsProgress.quizCompleted} THEN
              ${studentLessonsProgress.quizCompleted}
            ELSE false
          END`,
      })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          eq(studentLessonsProgress.lessonId, lesson.id),
        ),
      );

    if (!lessonProgress)
      throw new NotFoundException("Lesson progress not found");

    const lessonItems = await this.getLessonQuestions(
      lesson,
      userId,
      lessonProgress.quizCompleted,
    );

    const evaluationAnswers = lessonItems.map((item) => {
      if (lesson.type !== "quiz" || !lessonProgress.quizCompleted)
        return { ...item, passQuestion: null };

      let passQuestion = true;
      item.content.questionAnswers.forEach((answer) => {
        if (
          answer.isStudentAnswer !== answer.isCorrect ||
          isNull(answer.isStudentAnswer)
        ) {
          passQuestion = false;
        }
      });
      return { ...item, passQuestion };
    });

    return {
      ...lesson,
      imageUrl,
      lessonItems: evaluationAnswers,
      itemsCount: lessonItems.length,
      itemsCompletedCount: completedLessonItems.length,
      quizScore: evaluationAnswers.filter((item) => item.passQuestion).length,
    };
  }

  async evaluationQuiz(lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] = await this.checkLessonAssignment(
      lessonId,
      userId,
    );

    if (!accessCourseLessons)
      throw new UnauthorizedException(
        "You don't have assignment to this lesson",
      );

    const [lessonItemsCount] = await this.db
      .select({ count: count(lessonItems.id) })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId));

    const [completedLessonItemsCount] = await this.db
      .selectDistinct({
        count: count(studentCompletedLessonItems.id),
      })
      .from(studentCompletedLessonItems)
      .where(eq(studentCompletedLessonItems.lessonId, lessonId));

    if (lessonItemsCount.count !== completedLessonItemsCount.count)
      throw new ConflictException("Lesson is not completed");

    await this.db
      .insert(studentLessonsProgress)
      .values({
        studentId: userId,
        lessonId: lessonId,
        quizCompleted: true,
      })
      .onConflictDoUpdate({
        target: [
          studentLessonsProgress.studentId,
          studentLessonsProgress.lessonId,
        ],
        set: {
          quizCompleted: true,
        },
      });

    return true;
  }

  async clearQuizProgress(lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] = await this.checkLessonAssignment(
      lessonId,
      userId,
    );

    if (!accessCourseLessons)
      throw new UnauthorizedException(
        "You don't have assignment to this lesson",
      );

    const [quizProgress] = await this.db
      .select({ id: studentLessonsProgress.id })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          eq(studentLessonsProgress.lessonId, lessonId),
        ),
      );

    if (!quizProgress) throw new NotFoundException("Lesson progress not found");

    try {
      return await this.db.transaction(async (trx) => {
        const questionIds = await this.db
          .select({
            questionId: studentQuestionAnswers.questionId,
          })
          .from(studentQuestionAnswers)
          .leftJoin(
            lessonItems,
            eq(studentQuestionAnswers.questionId, lessonItems.lessonItemId),
          )
          .where(eq(lessonItems.lessonId, lessonId));

        await trx
          .update(studentLessonsProgress)
          .set({ quizCompleted: false })
          .where(
            and(
              eq(studentLessonsProgress.studentId, userId),
              eq(studentLessonsProgress.lessonId, lessonId),
            ),
          );

        await trx.delete(studentQuestionAnswers).where(
          and(
            eq(studentQuestionAnswers.studentId, userId),
            inArray(
              studentQuestionAnswers.questionId,
              questionIds.map((q) => q.questionId),
            ),
          ),
        );

        await trx
          .delete(studentCompletedLessonItems)
          .where(
            and(
              eq(studentCompletedLessonItems.studentId, userId),
              eq(studentCompletedLessonItems.lessonId, lessonId),
            ),
          );

        return true;
      });
    } catch (error) {
      return false;
    }
  }

  private async checkLessonAssignment(lessonId: UUIDType, userId: UUIDType) {
    return this.db
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
          eq(lessons.id, lessonId),
          eq(lessons.state, "published"),
        ),
      );
  }

  private async getLessonItems(lesson: Lesson, userId: string) {
    const lessonItemsList = await this.fetchLessonItemsFromDb(lesson.id);
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(
        async (item) => await this.processLessonItem(item, userId, lesson.type),
      ),
    );
  }

  private async getLessonQuestions(
    lesson: Lesson,
    userId: string,
    quizCompleted: boolean,
  ) {
    const lessonItemsList = await this.fetchLessonItemsFromDb(lesson.id);
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(async (item) => {
        const { questionData, lessonItemType, id, displayOrder } = item;

        if (isNull(questionData)) throw new Error("Question not found");

        const content = await this.processQuestionItem(
          { id, displayOrder, lessonItemType, questionData },
          userId,
          lesson.type,
          quizCompleted,
        );

        return {
          id: item.id,
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );
  }

  private async fetchLessonItemsFromDb(
    lessonId: string,
  ): Promise<LessonItemWithContentSchema[]> {
    return this.db
      .select({
        id: lessonItems.id,
        lessonItemType: lessonItems.lessonItemType,
        lessonItemId: lessonItems.id,
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
      .where(eq(lessonItems.lessonId, lessonId))
      .orderBy(lessonItems.displayOrder);
  }

  private async processLessonItem(
    item: LessonItemWithContentSchema,
    userId: string,
    lessonType: string,
  ): Promise<LessonItemResponse> {
    const content = await match(item)
      .returnType<Promise<LessonItemResponse["content"]>>()
      .with(
        { lessonItemType: "question", questionData: P.not(P.nullish) },
        async (item) => {
          const { questionData, lessonItemType, id, displayOrder } = item;
          return this.processQuestionItem(
            { id, displayOrder, lessonItemType, questionData },
            userId,
            lessonType,
            false,
          );
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
  }

  private async processQuestionItem(
    item: QuestionWithContent,
    userId: string,
    lessonType: string,
    lessonRated: boolean,
  ) {
    const questionAnswers = await this.db
      .select({
        id: questionAnswerOptions.id,
        optionText: questionAnswerOptions.optionText,
        position: questionAnswerOptions.position,
        isStudentAnswer: sql<boolean | null>`
        CASE
          WHEN ${studentQuestionAnswers.id} IS NULL THEN null
          WHEN EXISTS (
              SELECT 1
              FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
              WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(${questionAnswerOptions.optionText})
            )
          THEN true
          ELSE false
        END
        `,
        isCorrect: sql<boolean | null>`
        CASE
          WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
            ${questionAnswerOptions.isCorrect}
          ELSE null
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
      .where(eq(questionAnswerOptions.questionId, item.questionData.id))
      .groupBy(
        questionAnswerOptions.id,
        questionAnswerOptions.optionText,
        questionAnswerOptions.position,
        studentQuestionAnswers.id,
        studentQuestionAnswers.answer,
      );

    if (
      item.questionData.questionType !== "open_answer" &&
      item.questionData.questionType !== "fill_in_the_blanks_text" &&
      item.questionData.questionType !== "fill_in_the_blanks_dnd"
    ) {
      return {
        id: item.questionData.id,
        questionType: item.questionData.questionType,
        questionBody: item.questionData.questionBody,
        questionAnswers,
      };
    }

    if (item.questionData.questionType === "open_answer") {
      const studentAnswer = await this.db
        .select({
          id: studentQuestionAnswers.id,
          optionText: sql<string>`${studentQuestionAnswers.answer}->'answer_1'`,
          isStudentAnswer: sql<boolean>`true`,
          position: sql<number>`1`,
          isCorrect: sql<boolean | null>`
          CASE
            WHEN ${lessonType} = 'quiz' AND ${lessonRated} THEN
              ${studentQuestionAnswers.isCorrect}
            ELSE null
          END
        `,
        })
        .from(studentQuestionAnswers)
        .where(eq(studentQuestionAnswers.questionId, item.questionData.id))
        .limit(1);

      return {
        id: item.questionData.id,
        questionType: item.questionData.questionType,
        questionBody: item.questionData.questionBody,
        questionAnswers: studentAnswer,
      };
    }

    const [studentAnswers] = await this.db
      .select({
        id: studentQuestionAnswers.id,
        answer: sql<JSON>`${studentQuestionAnswers.answer}`,
        test: questionAnswerOptions.optionText,
      })
      .from(studentQuestionAnswers)
      .innerJoin(
        questionAnswerOptions,
        eq(questionAnswerOptions.questionId, studentQuestionAnswers.questionId),
      )
      .where(eq(studentQuestionAnswers.questionId, item.questionData.id))
      .limit(1);

    const result = !!studentAnswers?.answer
      ? Object.keys(studentAnswers.answer).map((key) => {
          const position = parseInt(key.split("_")[1]);
          const studentAnswerText = studentAnswers.answer[
            key as keyof typeof studentAnswers.answer
          ] as string;

          return {
            id: studentAnswers.id,
            optionText: studentAnswerText,
            position: position,
            isStudentAnswer: true,
            isCorrect: null,
          };
        })
      : [];

    return {
      id: item.questionData.id,
      questionType: item.questionData.questionType,
      questionBody: item.questionData.questionBody,
      questionAnswers: result,
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

    return await Promise.all(
      availableLessons.map(async (lesson) => {
        const imageUrl = lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl);
        return { ...lesson, imageUrl };
      }),
    );
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
