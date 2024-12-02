import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";

import { DatabasePg } from "src/common";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import { StudentCompletedLessonItemsService } from "src/studentCompletedLessonItem/studentCompletedLessonItems.service";

import { QuestionsRepository } from "./questions.repository";
import { QUESTION_TYPE } from "./schema/questions.types";

import type { AnswerQuestionSchema, QuestionSchema } from "./schema/question.schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "src/storage/schema";

@Injectable()
export class QuestionsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly studentCompletedLessonItemsService: StudentCompletedLessonItemsService,
    private readonly questionsRepository: QuestionsRepository,
    private readonly lessonsRepository: LessonsRepository,
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async questionAnswer(answerQuestion: AnswerQuestionSchema, userId: string) {
    return await this.db.transaction(async (trx) => {
      const questionData: QuestionSchema = await this.questionsRepository.fetchQuestionData(
        answerQuestion,
        trx,
      );

      if (!questionData || !questionData.questionId) {
        throw new NotFoundException("Question not found");
      }

      const lesson = await this.lessonsRepository.getLessonForUser(
        answerQuestion.courseId,
        answerQuestion.lessonId,
        userId,
      );

      const quizProgress = await this.lessonsRepository.getQuizProgress(
        answerQuestion.courseId,
        answerQuestion.lessonId,
        userId,
      );

      if (lesson.type === "quiz" && quizProgress?.quizCompleted)
        throw new ConflictException("Quiz already completed");

      const lastAnswerId = await this.questionsRepository.findExistingAnswer(
        userId,
        questionData.questionId,
        questionData.lessonId,
        answerQuestion.courseId,
        trx,
      );

      const questionTypeHandlers = {
        [QUESTION_TYPE.single_choice.key]: this.handleChoiceAnswer.bind(this),
        [QUESTION_TYPE.multiple_choice.key]: this.handleChoiceAnswer.bind(this),
        [QUESTION_TYPE.open_answer.key]: this.handleOpenAnswer.bind(this),
        [QUESTION_TYPE.fill_in_the_blanks_text.key]: this.handleFillInTheBlanksAnswer.bind(this),
        [QUESTION_TYPE.fill_in_the_blanks_dnd.key]: this.handleFillInTheBlanksAnswer.bind(this),
      } as const;

      const handler =
        questionTypeHandlers[questionData.questionType as keyof typeof questionTypeHandlers];

      if (!handler) {
        throw new NotAcceptableException("Unknown question type");
      }

      await handler(trx, questionData, answerQuestion, lastAnswerId, userId);

      await this.studentCompletedLessonItemsService.markLessonItemAsCompleted(
        questionData.lessonItemAssociationId,
        answerQuestion.courseId,
        questionData.lessonId,
        userId,
      );

      const [studentLessonProgress] = await this.lessonsRepository.updateStudentLessonProgress(
        userId,
        questionData.lessonId,
        answerQuestion.courseId,
      );

      if (
        !quizProgress?.completedAt &&
        studentLessonProgress?.completedLessonItemCount === lesson.itemsCount
      ) {
        const isCompletedAsFreemium = lesson.isFree && !lesson.enrolled;

        await this.lessonsRepository.completeLessonProgress(
          answerQuestion.courseId,
          questionData.lessonId,
          userId,
          isCompletedAsFreemium,
          trx,
        );

        const existingLessonProgress = await this.lessonsRepository.getLessonsProgressByCourseId(
          answerQuestion.courseId,
          trx,
        );

        if (isCompletedAsFreemium && existingLessonProgress.length === 0) {
          await this.statisticsRepository.updateCompletedAsFreemiumCoursesStats(userId, trx);
        }
      }
    });
  }

  private async handleChoiceAnswer(
    trx: PostgresJsDatabase<typeof schema>,
    questionData: QuestionSchema,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (!Array.isArray(answerQuestion.answer)) {
      throw new BadRequestException("Answer must be more than one option");
    }

    if (answerQuestion.answer.length < 1)
      return await this.questionsRepository.upsertAnswer(
        answerQuestion.courseId,
        questionData.lessonId,
        questionData.questionId,
        userId,
        lastAnswerId,
        [],
        trx,
      );

    const answerList = answerQuestion.answer.map((answerElement) => {
      if (typeof answerElement !== "string") {
        return answerElement.value;
      }

      return answerElement;
    });

    if (!answerList?.length) throw new NotFoundException("User answers not found");

    const answers: { answer: string }[] = await this.questionsRepository.getQuestionAnswers(
      answerQuestion.questionId,
      answerList,
      trx,
    );

    if (!answers || answers.length !== answerQuestion.answer.length)
      throw new NotFoundException("Answers not found");

    const studentAnswer = answers.reduce((acc, answer, index) => {
      acc.push(`'${index}'`, `'${answer.answer}'`);
      return acc;
    }, [] as string[]);

    await this.questionsRepository.upsertAnswer(
      answerQuestion.courseId,
      questionData.lessonId,
      questionData.questionId,
      userId,
      lastAnswerId,
      studentAnswer,
      trx,
    );
  }

  private async handleFillInTheBlanksAnswer(
    trx: PostgresJsDatabase<typeof schema>,
    questionData: QuestionSchema,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (!Array.isArray(answerQuestion.answer)) {
      throw new BadRequestException("Wrong answer format");
    }

    const studentAnswer = answerQuestion.answer.reduce((acc, answer) => {
      if (typeof answer === "string") return acc;

      acc.push(`'${answer.index}'`, `'${answer.value}'`);
      return acc;
    }, [] as string[]);

    await this.questionsRepository.upsertAnswer(
      answerQuestion.courseId,
      questionData.lessonId,
      questionData.questionId,
      userId,
      lastAnswerId,
      studentAnswer,
      trx,
    );
  }

  private async handleOpenAnswer(
    trx: PostgresJsDatabase<typeof schema>,
    questionData: QuestionSchema,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (Array.isArray(answerQuestion.answer))
      throw new NotAcceptableException(
        "Answer is required for open answer question and must be a string",
      );

    if (answerQuestion.answer.length < 1) {
      if (!lastAnswerId) return;

      await this.questionsRepository.deleteAnswer(lastAnswerId, trx);
      return;
    }

    const studentAnswer = [`'1'`, `'${answerQuestion.answer}'`];

    await this.questionsRepository.upsertAnswer(
      answerQuestion.courseId,
      questionData.lessonId,
      questionData.questionId,
      userId,
      lastAnswerId,
      studentAnswer,
      trx,
    );
    return;
  }
}
