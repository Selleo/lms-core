import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { isNull } from "lodash";
import { match, P } from "ts-pattern";

import { DatabasePg } from "src/common";
import { QuizCompletedEvent } from "src/events";
import { S3Service } from "src/file/s3.service";
import { LessonProgress } from "src/lessons/schemas/lesson.types";

import { LessonsRepository } from "./repositories/lessons.repository";

import type { Lesson } from "./schemas/lesson.schema";
import type {
  LessonItemResponse,
  LessonItemWithContentSchema,
  QuestionAnswer,
  QuestionResponse,
  QuestionWithContent,
} from "./schemas/lessonItem.schema";
import type { UUIDType } from "src/common";

@Injectable()
export class LessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly lessonsRepository: LessonsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async getLesson(id: UUIDType, courseId: UUIDType, userId: UUIDType, isAdmin?: boolean) {
    const [accessCourseLessons] = await this.lessonsRepository.checkLessonAssignment(
      courseId,
      id,
      userId,
    );
    const lesson = await this.lessonsRepository.getLessonForUser(courseId, id, userId);

    if (!isAdmin && !accessCourseLessons && !lesson.isFree)
      throw new UnauthorizedException("You don't have access to this lesson");

    if (!lesson) throw new NotFoundException("Lesson not found");

    const getImageUrl = async (url: string) => {
      if (!url || url.startsWith("https://")) return url;
      return await this.s3Service.getSignedUrl(url);
    };

    const imageUrl = await getImageUrl(lesson.imageUrl);

    const completedLessonItems = await this.lessonsRepository.completedLessonItem(
      courseId,
      lesson.id,
    );

    if (lesson.type !== "quiz") {
      const lessonItems = await this.getLessonItems(lesson, courseId, userId);

      const completableLessonItems = lessonItems.filter(
        (item) => item.lessonItemType !== "text_block",
      );

      return {
        ...lesson,
        imageUrl,
        lessonItems: lessonItems,
        itemsCount: completableLessonItems.length,
        lessonProgress:
          completableLessonItems.length === 0
            ? LessonProgress.notStarted
            : completableLessonItems.length > 0
              ? LessonProgress.inProgress
              : LessonProgress.completed,
        itemsCompletedCount: completedLessonItems.length,
      };
    }

    const lessonProgress = await this.lessonsRepository.lessonProgress(courseId, lesson.id, userId);

    if (!lessonProgress && !isAdmin && !lesson.isFree)
      throw new NotFoundException("Lesson progress not found");

    const isAdminOrFreeLessonWithoutLessonProgress = (isAdmin || lesson.isFree) && !lessonProgress;

    const questionLessonItems = await this.getLessonQuestions(
      lesson,
      courseId,
      userId,
      isAdminOrFreeLessonWithoutLessonProgress ? false : lessonProgress.quizCompleted,
    );

    return {
      ...lesson,
      imageUrl,
      lessonItems: questionLessonItems,
      itemsCount: isAdminOrFreeLessonWithoutLessonProgress ? 0 : lessonProgress.lessonItemCount,
      itemsCompletedCount: isAdminOrFreeLessonWithoutLessonProgress
        ? 0
        : lessonProgress.completedLessonItemCount,
      quizScore: isAdminOrFreeLessonWithoutLessonProgress ? 0 : lessonProgress.quizScore,
      lessonProgress: isAdminOrFreeLessonWithoutLessonProgress
        ? LessonProgress.notStarted
        : lessonProgress.completedLessonItemCount === 0
          ? LessonProgress.notStarted
          : lessonProgress.completedLessonItemCount > 0
            ? LessonProgress.inProgress
            : LessonProgress.completed,
    };
  }

  async evaluationQuiz(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] = await this.lessonsRepository.checkLessonAssignment(
      courseId,
      lessonId,
      userId,
    );

    if (!accessCourseLessons.isAssigned && !accessCourseLessons.isFree)
      throw new UnauthorizedException("You don't have assignment to this lesson");

    const quizProgress = await this.lessonsRepository.getQuizProgress(courseId, lessonId, userId);

    if (quizProgress?.quizCompleted) throw new ConflictException("Quiz already completed");

    const lessonItemsCount = await this.lessonsRepository.getLessonItemCount(lessonId);

    const completedLessonItemsCount = await this.lessonsRepository.completedLessonItemsCount(
      courseId,
      lessonId,
    );

    if (lessonItemsCount.count !== completedLessonItemsCount.count)
      throw new ConflictException("Lesson is not completed");

    const evaluationResult = await this.evaluationsQuestions(courseId, lessonId, userId);

    if (!evaluationResult) return false;

    const quizScore = await this.lessonsRepository.getQuizScore(courseId, lessonId, userId);

    const updateQuizResult = await this.lessonsRepository.completeQuiz(
      courseId,
      lessonId,
      userId,
      completedLessonItemsCount.count,
      quizScore,
    );

    if (!updateQuizResult) return false;

    return true;
  }

  private async evaluationsQuestions(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const lesson = await this.lessonsRepository.getLessonForUser(courseId, lessonId, userId);
    const questionLessonItems = await this.getLessonQuestionsToEvaluation(
      lesson,
      courseId,
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
              courseId,
              lessonId,
              lesson.type,
              true,
              trx,
            );

            const passQuestion = await match(questionLessonItem.content.questionType)
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
              courseId,
              lessonId,
              questionLessonItem.content.id,
              userId,
              passQuestion,
              trx,
            );
          }),
        );
      });

      const correctAnswerCount = questionLessonItems
        .map(
          (item) =>
            item.content.questionAnswers.filter((answer) => Boolean(answer.isCorrect)).length,
        )
        .reduce((acc, count) => acc + count, 0);

      const totalQuestions = questionLessonItems.length;
      const wrongAnswerCount = totalQuestions - correctAnswerCount;

      const score = Math.round((correctAnswerCount / totalQuestions) * 100);

      this.eventBus.publish(
        new QuizCompletedEvent(
          userId,
          courseId,
          lessonId,
          correctAnswerCount,
          wrongAnswerCount,
          score,
        ),
      );

      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  async clearQuizProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
    const [accessCourseLessons] = await this.lessonsRepository.checkLessonAssignment(
      courseId,
      lessonId,
      userId,
    );

    if (!accessCourseLessons)
      throw new UnauthorizedException("You don't have assignment to this lesson");

    const quizProgress = await this.lessonsRepository.lessonProgress(courseId, lessonId, userId);

    if (!quizProgress) throw new NotFoundException("Lesson progress not found");

    try {
      return await this.db.transaction(async (trx) => {
        const questionIds = await this.lessonsRepository.getQuestionsIdsByLessonId(lessonId);

        await this.lessonsRepository.retireQuizProgress(courseId, lessonId, userId, trx);

        await this.lessonsRepository.removeQuestionsAnswer(
          courseId,
          lessonId,
          questionIds,
          userId,
          trx,
        );

        await this.lessonsRepository.removeStudentCompletedLessonItems(
          courseId,
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

  private async getLessonItems(lesson: Lesson, courseId: UUIDType, userId: UUIDType) {
    const lessonItemsList = await this.lessonsRepository.getLessonItems(lesson.id);
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(
        async (item) =>
          await this.processLessonItem(item, userId, courseId, lesson.id, lesson.type),
      ),
    );
  }

  private async getLessonQuestions(
    lesson: Lesson,
    courseId: UUIDType,
    userId: UUIDType,
    quizCompleted: boolean,
  ) {
    const questionItemsForLesson = await this.lessonsRepository.getQuestionItems(
      lesson.id,
      userId,
      lesson.type,
      quizCompleted,
    );

    return await Promise.all(
      questionItemsForLesson.map(async (item) => {
        const { lessonItemId, questionData, lessonItemType, displayOrder, passQuestion } = item;

        if (isNull(questionData)) throw new Error("Question not found");

        const content = await this.processQuestionItem(
          { lessonItemId, displayOrder, lessonItemType, questionData },
          userId,
          courseId,
          lesson.id,
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
    courseId: UUIDType,
    userId: UUIDType,
    quizCompleted: boolean,
  ) {
    const lessonItemsList = await this.lessonsRepository.getLessonItems(lesson.id);
    const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

    return await Promise.all(
      validLessonItemsList.map(async (item) => {
        const { lessonItemId, questionData, lessonItemType, displayOrder } = item;

        if (isNull(questionData)) throw new Error("Question not found");

        const content = await this.processQuestionItem(
          { lessonItemId, displayOrder, lessonItemType, questionData },
          userId,
          courseId,
          lesson.id,
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
    userId: UUIDType,
    courseId: UUIDType,
    lessonId: UUIDType,
    lessonType: string,
  ): Promise<LessonItemResponse> {
    const content = await match(item)
      .returnType<Promise<LessonItemResponse["content"]>>()
      .with({ lessonItemType: "question", questionData: P.not(P.nullish) }, async (item) => {
        const { lessonItemId, questionData, lessonItemType, displayOrder } = item;
        return this.processQuestionItem(
          { lessonItemId, displayOrder, lessonItemType, questionData },
          userId,
          courseId,
          lessonId,
          lessonType,
          false,
          null,
        );
      })
      .with({ lessonItemType: "text_block", textBlockData: P.not(P.nullish) }, async (item) => ({
        id: item.textBlockData.id,
        body: item.textBlockData.body ?? "",
        state: item.textBlockData.state ?? "",
        title: item.textBlockData.title,
      }))
      .with({ lessonItemType: "file", fileData: P.not(P.nullish) }, async (item) => ({
        id: item.fileData.id,
        title: item.fileData.title,
        type: item.fileData.type,
        url: (item.fileData.url as string).startsWith("https://")
          ? item.fileData.url
          : await this.s3Service.getSignedUrl(item.fileData.url),
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
  }

  private async processQuestionItem(
    item: QuestionWithContent,
    userId: UUIDType,
    courseId: UUIDType,
    lessonId: UUIDType,
    lessonType: string,
    lessonRated: boolean,
    passQuestion: boolean | null,
  ): Promise<QuestionResponse> {
    const questionAnswers: QuestionAnswer[] = await this.lessonsRepository.getQuestionAnswers(
      item.questionData.id,
      userId,
      courseId,
      lessonId,
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
      const studentAnswer = await this.lessonsRepository.getOpenQuestionStudentAnswer(
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

    const [studentAnswers] = await this.lessonsRepository.getFillInTheBlanksStudentAnswers(
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
            const isStudentAnswer = correctAnswerToStudentAnswer?.optionText === studentAnswerText;

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

      const canShowSolutionExplanation =
        !!studentAnswers?.answer && lessonRated && lessonType === "quiz";

      return {
        id: item.questionData.id,
        questionType: item.questionData.questionType,
        questionBody: item.questionData.questionBody,
        solutionExplanation: canShowSolutionExplanation
          ? item.questionData.solutionExplanation
          : null,
        questionAnswers: result,
        passQuestion,
      };
    }

    const result = questionAnswers.map((answer) => {
      return {
        id: answer.id,
        optionText: answer.optionText,
        position:
          (lessonRated && answer.isCorrect) ||
          (lessonType !== "quiz" &&
            typeof answer?.position === "number" &&
            studentAnswers?.answer[answer.position])
            ? answer.position
            : null,
        isStudentAnswer: lessonRated ? answer.isStudentAnswer : null,
        studentAnswerText:
          typeof answer?.position === "number" ? studentAnswers?.answer[answer.position] : null,
        isCorrect: lessonRated ? answer.isCorrect : null,
      };
    });

    const canShowSolutionExplanation =
      !!studentAnswers?.answer && lessonRated && lessonType === "quiz";

    return {
      id: item.questionData.id,
      questionType: item.questionData.questionType,
      questionBody: item.questionData.questionBody,
      questionAnswers: result,
      solutionExplanation: canShowSolutionExplanation
        ? item.questionData.solutionExplanation
        : null,
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
