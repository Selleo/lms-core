import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type { DatabasePg, UUIDType } from "src/common";
import { match, P } from "ts-pattern";
import { Lesson } from "./schemas/lesson.schema";
import {
  LessonItemResponse,
  LessonItemWithContentSchema,
  QuestionAnswer,
  QuestionResponse,
  QuestionWithContent,
} from "./schemas/lessonItem.schema";
import { isNull } from "lodash";
import { S3Service } from "src/file/s3.service";
import { LessonsRepository } from "./repositories/lessons.repository";

@Injectable()
export class LessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async getLesson(id: UUIDType, userId: UUIDType, isAdmin?: boolean) {
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
      itemsCount: lessonProgress.lessonItemCount,
      itemsCompletedCount: lessonProgress.completedLessonItemCount,
      quizScore: lessonProgress.quizScore,
    };
  }

  async evaluationQuiz(lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] =
      await this.lessonsRepository.checkLessonAssignment(lessonId, userId);

    if (!accessCourseLessons)
      throw new UnauthorizedException(
        "You don't have assignment to this lesson",
      );

    const quizProgress = await this.lessonsRepository.getQuizProgress(
      lessonId,
      userId,
    );

    if (quizProgress.quizCompleted)
      throw new ConflictException("Quiz already completed");

    const lessonItemsCount =
      await this.lessonsRepository.getLessonItemCount(lessonId);

    const completedLessonItemsCount =
      await this.lessonsRepository.completedLessonItemsCount(lessonId);

    if (lessonItemsCount.count !== completedLessonItemsCount.count)
      throw new ConflictException("Lesson is not completed");

    const evaluationResult = await this.evaluationsQuestions(lessonId, userId);

    if (!evaluationResult) return false;

    const quizScore = await this.lessonsRepository.getQuizScore(
      lessonId,
      userId,
    );

    const updateQuizResult = await this.lessonsRepository.completeQuiz(
      lessonId,
      userId,
      completedLessonItemsCount.count,
      quizScore,
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
              .with("fill_in_the_blanks_text", async () => {
                const question = questionLessonItem.content;
                let passQuestion = true;

                for (const answer of question.questionAnswers) {
                  if (answer.optionText != answer.studentAnswerText) {
                    passQuestion = false;
                    break;
                  }
                }

                return passQuestion;
              })
              .with("fill_in_the_blanks_dnd", async () => {
                const question = questionLessonItem.content;
                let passQuestion = true;

                for (const answer of question.questionAnswers) {
                  if (answer.isStudentAnswer != answer.isCorrect) {
                    passQuestion = false;
                    break;
                  }
                }

                return passQuestion;
              })
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
          lessonId,
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

  private async getLessonItems(lesson: Lesson, userId: UUIDType) {
    const lessonItemsList = await this.lessonsRepository.getLessonItems(
      lesson.id,
    );
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(
        async (item) =>
          await this.processLessonItem(item, userId, lesson.id, lesson.type),
      ),
    );
  }

  private async getLessonQuestions(
    lesson: Lesson,
    userId: UUIDType,
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
          lesson.id,
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
    userId: UUIDType,
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
          lesson.id,
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
    userId: UUIDType,
    lessonId: UUIDType,
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
            lessonId,
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
    userId: UUIDType,
    lessonType: string,
    lessonId: UUIDType,
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
      const studentAnswer =
        await this.lessonsRepository.getOpenQuestionStudentAnswer(
          lessonId,
          item.questionData.id,
          userId,
          lessonType,
          lessonRated,
        );

      return {
        id: item.questionData.id,
        questionType: item.questionData.questionType,
        questionBody: item.questionData.questionBody,
        questionAnswers: studentAnswer,
        passQuestion,
      };
    }

    const [studentAnswers] =
      await this.lessonsRepository.getFillInTheBlanksStudentAnswers(
        userId,
        item.questionData.id,
        lessonId,
      );
    // TODO: refactor DB query
    if (item.questionData.questionType == "fill_in_the_blanks_text") {
      const result = !!studentAnswers?.answer
        ? Object.keys(studentAnswers.answer).map((key) => {
            const position = parseInt(key);

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
              studentAnswerText:
                (lessonRated && lessonType === "quiz") || lessonType !== "quiz"
                  ? studentAnswerText
                  : null,
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
        position:
          (lessonRated && answer.isCorrect) || lessonType !== "quiz"
            ? answer.position
            : null,
        isStudentAnswer: lessonRated ? answer.isStudentAnswer : null,
        studentAnswerText:
          typeof answer?.position === "number"
            ? studentAnswers?.answer[answer.position]
            : null,
        isCorrect: lessonRated ? answer.isCorrect : null,
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
