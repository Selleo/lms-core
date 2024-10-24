import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import type { DatabasePg, UUIDType } from "src/common";
import {
  lessons,
  questionAnswerOptions,
  studentQuestionAnswers,
} from "src/storage/schema";
import { match, P } from "ts-pattern";
import {
  LessonItemResponse,
  LessonItemWithContentSchema,
  QuestionAnswer,
  QuestionResponse,
  QuestionWithContent,
} from "./schemas/lessonItem.schema";
import { isEmpty, isNull } from "lodash";
import { Lesson } from "./schemas/lesson.schema";
import { S3Service } from "src/file/s3.service";
import { CreateLessonBody, UpdateLessonBody } from "./schemas/lesson.schema";
import { LessonsRepository } from "./lessons.repository";

@Injectable()
export class LessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async getAllLessons() {
    const lessonsData = await this.lessonsRepository.getLessons();

    return Promise.all(
      lessonsData.map(async (lesson) => ({
        ...lesson,
        imageUrl: lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl),
      })),
    );
  }

  async getLessonById(id: string) {
    const lesson = await this.lessonsRepository.getLessonById(id);

    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessonItemsList = await this.lessonsRepository.getLessonItems(id);

    const items = await Promise.all(
      lessonItemsList.map(async (item) => {
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
                })
                .from(questionAnswerOptions)
                .where(
                  eq(questionAnswerOptions.questionId, item.questionData.id),
                );

              return {
                id: item.questionData.id,
                questionType: item.questionData.questionType,
                questionBody: item.questionData.questionBody,
                questionAnswers,
                state: item.questionData.state,
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
              url: item.fileData.url,
              state: item.fileData.state,
            }),
          )
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

    return {
      ...lesson,
      lessonItems: items,
      itemsCount: items.length,
    };
  }

  async getLesson(id: string, userId: string, isAdmin?: boolean) {
    const [accessCourseLessons] =
      await this.lessonsRepository.checkLessonAssignment(id, userId);

    if (!isAdmin && !accessCourseLessons)
      throw new UnauthorizedException("You don't have access to this lesson");

    const lesson = await this.lessonsRepository.getLessonForUser(id, userId);

    if (!lesson) throw new NotFoundException("Lesson not found");

    const imageUrl = (lesson.imageUrl as string).startsWith("https://")
      ? lesson.imageUrl
      : await this.s3Service.getSignedUrl(lesson.imageUrl);

    const completedLessonItems =
      await this.lessonsRepository.completedLessonItem(lesson.id);

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

    const lessonProgress = await this.lessonsRepository.lessonProgress(
      lesson.id,
      userId,
    );

    if (!lessonProgress)
      throw new NotFoundException("Lesson progress not found");

    const questionLessonItems = await this.getLessonQuestions(
      lesson,
      userId,
      lessonProgress.quizCompleted,
    );

    return {
      ...lesson,
      imageUrl,
      lessonItems: questionLessonItems,
      itemsCount: questionLessonItems.length,
      itemsCompletedCount: completedLessonItems.length,
      quizScore: questionLessonItems.filter((item) => item.content.passQuestion)
        .length,
    };
  }

  async evaluationQuiz(lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] =
      await this.lessonsRepository.checkLessonAssignment(lessonId, userId);

    if (!accessCourseLessons)
      throw new UnauthorizedException(
        "You don't have assignment to this lesson",
      );

    const lessonItemsCount =
      await this.lessonsRepository.lessonItemCount(lessonId);

    // do poprawy oznaczanie jako zakonczonego
    const completedLessonItemsCount =
      await this.lessonsRepository.completedLessonItemsCount(lessonId);

    if (lessonItemsCount.count !== completedLessonItemsCount.count)
      throw new ConflictException("Lesson is not completed");

    const evaluationResult = await this.evaluationsQuestions(lessonId, userId);

    if (!evaluationResult) return false;

    const updateQuizResult = await this.lessonsRepository.completeQuiz(
      lessonId,
      userId,
    );

    if (!updateQuizResult) return false;

    return true;
  }

  private async evaluationsQuestions(lessonId: UUIDType, userId: UUIDType) {
    const lesson = await this.lessonsRepository.getLessonForUser(
      lessonId,
      userId,
    );
    const questionLessonItems = await this.getLessonQuestionsToEvaluation(
      lesson,
      userId,
      true,
    );
    try {
      await this.db.transaction(async (trx) => {
        await Promise.all(
          questionLessonItems.map(async (questionLessonItem) => {
            const answers = await this.lessonsRepository.getQuestionAnswers(
              questionLessonItem.content.id,
              userId,
              lesson.type,
              true,
              trx,
            );

            const passQuestion = await match(
              questionLessonItem.content.questionType,
            )
              .returnType<Promise<boolean>>()
              .with(
                P.union("fill_in_the_blanks_text", "fill_in_the_blanks_dnd"),
                async () => {
                  const question = questionLessonItem.content;
                  let passQuestion = true;

                  for (const answer of question.questionAnswers) {
                    if (answer.optionText != answer.studentAnswerText) {
                      passQuestion = false;
                      break;
                    }
                  }

                  return passQuestion;
                },
              )
              .otherwise(async () => {
                let passQuestion = true;
                for (const answer of answers) {
                  if (
                    answer.isStudentAnswer !== answer.isCorrect ||
                    isNull(answer.isStudentAnswer)
                  ) {
                    passQuestion = false;
                    break;
                  }
                }

                return passQuestion;
              });

            await this.lessonsRepository.setCorrectAnswerForStudentAnswer(
              questionLessonItem.content.id,
              userId,
              passQuestion,
              trx,
            );
          }),
        );
      });
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  async clearQuizProgress(lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] =
      await this.lessonsRepository.checkLessonAssignment(lessonId, userId);

    if (!accessCourseLessons)
      throw new UnauthorizedException(
        "You don't have assignment to this lesson",
      );

    const quizProgress = await this.lessonsRepository.lessonProgress(
      lessonId,
      userId,
    );

    if (!quizProgress) throw new NotFoundException("Lesson progress not found");

    try {
      return await this.db.transaction(async (trx) => {
        const questionIds =
          await this.lessonsRepository.getQuestionsIdsByLessonId(lessonId);

        await this.lessonsRepository.retireQuizProgress(lessonId, userId, trx);

        await this.lessonsRepository.removeQuestionsAnswer(
          questionIds,
          userId,
          trx,
        );

        await this.lessonsRepository.removeStudentCompletedLessonItems(
          lessonId,
          userId,
          trx,
        );

        return true;
      });
    } catch (error) {
      return false;
    }
  }

  private async getLessonItems(lesson: Lesson, userId: string) {
    const lessonItemsList = await this.lessonsRepository.getLessonItems(
      lesson.id,
    );
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
    const questionItemsForLesson =
      await this.lessonsRepository.getQuestionItems(
        lesson.id,
        userId,
        lesson.type,
        quizCompleted,
      );

    return await Promise.all(
      questionItemsForLesson.map(async (item) => {
        const {
          lessonItemId,
          questionData,
          lessonItemType,
          displayOrder,
          passQuestion,
        } = item;

        if (isNull(questionData)) throw new Error("Question not found");

        const content = await this.processQuestionItem(
          { lessonItemId, displayOrder, lessonItemType, questionData },
          userId,
          lesson.type,
          quizCompleted,
          passQuestion,
        );

        return {
          lessonItemId: item.lessonItemId,
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );
  }

  private async getLessonQuestionsToEvaluation(
    lesson: Lesson,
    userId: string,
    quizCompleted: boolean,
  ) {
    const lessonItemsList = await this.lessonsRepository.getLessonItems(
      lesson.id,
    );
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(async (item) => {
        const { lessonItemId, questionData, lessonItemType, displayOrder } =
          item;

        if (isNull(questionData)) throw new Error("Question not found");

        const content = await this.processQuestionItem(
          { lessonItemId, displayOrder, lessonItemType, questionData },
          userId,
          lesson.type,
          quizCompleted,
          null,
        );

        return {
          lessonItemId: item.lessonItemId,
          lessonItemType: item.lessonItemType,
          displayOrder: item.displayOrder,
          content,
        };
      }),
    );
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
          const { lessonItemId, questionData, lessonItemType, displayOrder } =
            item;
          return this.processQuestionItem(
            { lessonItemId, displayOrder, lessonItemType, questionData },
            userId,
            lessonType,
            false,
            null,
          );
        },
      )
      .with(
        { lessonItemType: "text_block", textBlockData: P.not(P.nullish) },
        async (item) => ({
          id: item.textBlockData.id,
          body: item.textBlockData.body ?? "",
          state: item.textBlockData.state ?? "",
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
      lessonItemId: item.lessonItemId,
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
    passQuestion: boolean | null,
  ): Promise<QuestionResponse> {
    const questionAnswers: QuestionAnswer[] =
      await this.lessonsRepository.getQuestionAnswers(
        item.questionData.id,
        userId,
        lessonType,
        lessonRated,
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
        passQuestion,
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
        passQuestion,
      };
    }

    const [studentAnswers] = await this.db
      .select({
        id: studentQuestionAnswers.id,
        answer: sql<JSON>`${studentQuestionAnswers.answer}`,
        isCorrect: studentQuestionAnswers.isCorrect,
      })
      .from(studentQuestionAnswers)
      .where(eq(studentQuestionAnswers.questionId, item.questionData.id))
      .limit(1);

    if (item.questionData.questionType == "fill_in_the_blanks_text") {
      const result = !!studentAnswers?.answer
        ? Object.keys(studentAnswers.answer).map((key) => {
            const position = parseInt(key.split("_")[1]);
            const studentAnswerText = studentAnswers.answer[
              key as keyof typeof studentAnswers.answer
            ] as string;

            const correctAnswerToStudentAnswer = questionAnswers.find(
              (answer) => answer.position === position,
            );
            const isCorrect = correctAnswerToStudentAnswer
              ? correctAnswerToStudentAnswer.isCorrect
              : false;

            const isStudentAnswer =
              correctAnswerToStudentAnswer?.optionText === studentAnswerText;

            return {
              id: studentAnswers.id,
              optionText: correctAnswerToStudentAnswer?.optionText ?? "",
              position: position,
              isStudentAnswer,
              studentAnswerText,
              isCorrect,
            };
          })
        : [];

      return {
        id: item.questionData.id,
        questionType: item.questionData.questionType,
        questionBody: item.questionData.questionBody,
        questionAnswers: result,
        passQuestion,
      };
    }

    const result = questionAnswers.map((answer) => {
      return {
        id: answer.id,
        optionText: answer.optionText,
        position: null,
        isStudentAnswer: null,
        studentAnswerText: "",
        isCorrect: null,
      };
    });

    return {
      id: item.questionData.id,
      questionType: item.questionData.questionType,
      questionBody: item.questionData.questionBody,
      questionAnswers: result,
      passQuestion,
    };
  }

  async getAvailableLessons() {
    const availableLessons = await this.lessonsRepository.getAvailableLessons();

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

  async createLesson(body: CreateLessonBody, authorId: string) {
    const [lesson] = await this.db
      .insert(lessons)
      .values({ ...body, authorId })
      .returning();

    if (!lesson) throw new NotFoundException("Lesson not found");
  }

  async updateLesson(id: string, body: UpdateLessonBody) {
    const [lesson] = await this.db
      .update(lessons)
      .set(body)
      .where(eq(lessons.id, id))
      .returning();

    if (!lesson) throw new NotFoundException("Lesson not found");
  }

  async addLessonToCourse(
    courseId: string,
    lessonId: string,
    displayOrder?: number,
  ) {
    try {
      if (displayOrder === undefined) {
        const maxOrderResult =
          await this.lessonsRepository.getMaxOrderLessonsInCourse(courseId);

        displayOrder = maxOrderResult + 1;
      }

      await this.lessonsRepository.assignLessonToCourse(
        courseId,
        lessonId,
        displayOrder,
      );
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
    const result = await this.lessonsRepository.removeCourseLesson(
      courseId,
      lessonId,
    );

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.lessonsRepository.updateDisplayOrderLessonsInCourse(
      courseId,
      lessonId,
    );
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
