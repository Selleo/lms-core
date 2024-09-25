import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { DatabasePg } from "src/common";
import { AnswerQuestionSchema, QuestionSchema } from "./schema/question.schema";
import {
  lessonItems,
  lessons,
  questionAnswerOptions,
  questions,
  studentQuestionAnswers,
} from "src/storage/schema";
import { and, eq, inArray } from "drizzle-orm";
import { QuestionType } from "./schema/questionsSchema";
import { StudentCompletedLessonItemsService } from "src/studentCompletedLessonItem/studentCompletedLessonItems.service";

@Injectable()
export class QuestionsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly studentCompletedLessonItemsService: StudentCompletedLessonItemsService,
  ) {}

  async questionAnswer(answerQuestion: AnswerQuestionSchema, userId: string) {
    return await this.db.transaction(async (trx) => {
      const questionData: QuestionSchema = await this.fetchQuestionData(
        trx,
        answerQuestion,
      );

      if (!questionData || !questionData.questionId) {
        throw new NotFoundException("Question not found");
      }

      const lastAnswerId = await this.findExistingAnswer(
        trx,
        userId,
        questionData.questionId,
      );

      const questionTypeHandlers = {
        [QuestionType.single_choice.key]: this.handleSingleChoice.bind(this),
        [QuestionType.multiple_choice.key]:
          this.handleMultipleChoice.bind(this),
        [QuestionType.open_answer.key]: this.handleOpenAnswer.bind(this),
      } as const;

      const handler =
        questionTypeHandlers[
          questionData.questionType as keyof typeof questionTypeHandlers
        ];

      if (!handler) {
        throw new NotAcceptableException("Unknown question type");
      }

      await handler(trx, questionData, answerQuestion, lastAnswerId, userId);

      await this.studentCompletedLessonItemsService.markLessonItemAsCompleted(
        questionData.lessonItemAssociationId,
        userId,
      );
    });
  }

  private async fetchQuestionData(
    trx: any,
    answerQuestion: AnswerQuestionSchema,
  ): Promise<QuestionSchema> {
    const [questionData] = await trx
      .select({
        lessonId: lessons.id,
        questionId: questions.id,
        questionType: questions.questionType,
        lessonItemAssociationId: lessonItems.id,
      })
      .from(lessons)
      .innerJoin(
        lessonItems,
        and(
          eq(lessonItems.lessonId, answerQuestion.lessonId),
          eq(lessonItems.lessonItemId, answerQuestion.questionId),
        ),
      )
      .leftJoin(
        questions,
        and(
          eq(questions.id, lessonItems.lessonItemId),
          eq(questions.archived, false),
          eq(questions.state, "published"),
        ),
      )
      .where(
        and(
          eq(lessons.id, lessonItems.lessonId),
          eq(lessons.archived, false),
          eq(lessons.state, "published"),
        ),
      );

    return questionData;
  }

  private async findExistingAnswer(
    trx: any,
    userId: string,
    questionId: string,
  ): Promise<string | null> {
    const [existingAnswer] = await trx
      .select({
        id: studentQuestionAnswers.id,
      })
      .from(studentQuestionAnswers)
      .where(
        and(
          eq(studentQuestionAnswers.studentId, userId),
          eq(studentQuestionAnswers.questionId, questionId),
        ),
      );

    return existingAnswer?.id;
  }

  private async handleSingleChoice(
    trx: any,
    questionData: any,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (!(answerQuestion.answer.length === 1)) {
      throw new NotAcceptableException("Answer must be one option");
    }

    const [answer] = await trx
      .select({
        id: questionAnswerOptions.id,
        questionsId: questionAnswerOptions.questionId,
        answer: questionAnswerOptions.optionText,
      })
      .from(questionAnswerOptions)
      .where(
        and(
          eq(questionAnswerOptions.questionId, questionData.questionId),
          eq(questionAnswerOptions.id, answerQuestion.answer[0]),
        ),
      );

    if (!answer) throw new NotFoundException("Answer not found");

    const studentAnswer = { answer_1: answer.answer };

    await this.upsertAnswer(
      trx,
      questionData.questionId,
      studentAnswer,
      userId,
      lastAnswerId,
    );
  }

  private async handleMultipleChoice(
    trx: any,
    questionData: QuestionSchema,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (
      !Array.isArray(answerQuestion.answer) ||
      answerQuestion.answer.length <= 1
    ) {
      throw new BadRequestException("Answer must be more than one option");
    }

    const answers: { answer: string }[] = await trx
      .select({
        answer: questionAnswerOptions.optionText,
      })
      .from(questionAnswerOptions)
      .where(
        and(
          eq(questionAnswerOptions.questionId, questionData.questionId),
          inArray(questionAnswerOptions.id, answerQuestion.answer),
        ),
      );

    if (!answers || answers.length !== answerQuestion.answer.length)
      throw new NotFoundException("Answers not found");

    const studentAnswer = answers.reduce(
      (acc, answer, index) => {
        acc[`answer_${index + 1}`] = answer.answer;
        return acc;
      },
      {} as Record<string, string>,
    );

    await this.upsertAnswer(
      trx,
      questionData.questionId,
      studentAnswer,
      userId,
      lastAnswerId,
    );
  }

  private async handleOpenAnswer(
    trx: any,
    questionData: QuestionSchema,
    answerQuestion: AnswerQuestionSchema,
    lastAnswerId: string | null,
    userId: string,
  ): Promise<void> {
    if (!answerQuestion.answer || Array.isArray(answerQuestion.answer))
      throw new NotAcceptableException(
        "Answer is required for open answer question and must be a string",
      );

    const studentAnswer = { answer_1: answerQuestion.answer };

    await this.upsertAnswer(
      trx,
      questionData.questionId,
      studentAnswer,
      userId,
      lastAnswerId,
    );
  }

  private async upsertAnswer(
    trx: any,
    questionId: string,
    answer: Record<string, string>,
    userId: string,
    answerId: string | null,
  ): Promise<void> {
    if (answerId) {
      await trx
        .update(studentQuestionAnswers)
        .set({ answer })
        .where(eq(studentQuestionAnswers.id, answerId));
      return;
    }

    await trx.insert(studentQuestionAnswers).values({
      questionId,
      answer,
      studentId: userId,
    });
  }
}
