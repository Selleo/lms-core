import { Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { match } from "ts-pattern";

import { DatabasePg } from "src/common";

import { QuestionRepository } from "./question.repository";
import { QUESTION_TYPE } from "./schema/question.types";

import type { QuizEvaluation } from "./schema/question.schema";
import type { QuestionTypes } from "./schema/question.types";
import type { SQL } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { UUIDType } from "src/common";
import type { AnswerQuestionBody } from "src/lesson/lesson.schema";
import type * as schema from "src/storage/schema";

@Injectable()
export class QuestionService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async evaluationsQuestions(
    quizQuestions: {
      id: string;
      type: QuestionTypes;
      correctAnswers: { displayOrder: number; value: string }[];
    }[],
    quizAnswers: AnswerQuestionBody,
    userId: UUIDType,
    trx: PostgresJsDatabase<typeof schema>,
  ) {
    try {
      const quizEvaluationStats = quizQuestions.reduce(
        (quizStats, question) => {
          const questionAnswerList = quizAnswers.answers.filter(
            (answer) => answer.questionId === question.id,
          );

          if (questionAnswerList.length !== 1) throw new Error("Answer is not valid");

          const questionAnswer = questionAnswerList[0];
          const passQuestion = match(question.type)
            .returnType<boolean>()
            .with(
              QUESTION_TYPE.fill_in_the_blanks_text.key || QUESTION_TYPE.fill_in_the_blanks_dnd.key,
              () => {
                let passQuestion = true;

                for (const correctAnswer of question.correctAnswers) {
                  if (
                    questionAnswer.answer[correctAnswer.displayOrder - 1].value !==
                    correctAnswer.value
                  ) {
                    passQuestion = false;
                    break;
                  }
                }

                return passQuestion;
              },
            )
            .with(QUESTION_TYPE.open_answer.key, () => {
              // TODO: implement this
              return true;
            })
            .otherwise(() => {
              let passQuestion = true;

              for (const correctAnswer of question.correctAnswers) {
                const studentAnswer = questionAnswer.answer.filter(
                  (answer) => answer.value === correctAnswer.value,
                );

                if (studentAnswer.length !== 1) {
                  passQuestion = false;
                  break;
                }
              }

              return passQuestion;
            });

          const formattedAnswer = this.questionAnswerToString(questionAnswer.answer, question.type);
          const validAnswer = {
            questionId: question.id,
            studentId: userId,
            answer: formattedAnswer,
            isCorrect: passQuestion,
          };

          passQuestion ? quizStats.correctAnswerCount++ : quizStats.wrongAnswerCount++;
          quizStats.answers.push(validAnswer);

          return quizStats;
        },
        {
          answers: [],
          correctAnswerCount: 0,
          wrongAnswerCount: 0,
        } as QuizEvaluation,
      );

      await this.questionRepository.insertQuizAnswers(quizEvaluationStats.answers, trx);

      return quizEvaluationStats;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  private questionAnswerToString(
    answers: {
      index: number;
      value: string;
    }[],
    questionType: QuestionTypes,
  ): SQL<unknown> {
    const questionTypeHandlers = {
      [QUESTION_TYPE.single_choice.key]: this.handleChoiceAnswer.bind(this),
      [QUESTION_TYPE.multiple_choice.key]: this.handleChoiceAnswer.bind(this),
      [QUESTION_TYPE.open_answer.key]: this.handleOpenAnswer.bind(this),
      [QUESTION_TYPE.fill_in_the_blanks_text.key]: this.handleFillInTheBlanksAnswer.bind(this),
      [QUESTION_TYPE.fill_in_the_blanks_dnd.key]: this.handleFillInTheBlanksAnswer.bind(this),
    } as const;

    const handler = questionTypeHandlers[questionType];

    if (!handler) {
      throw new NotAcceptableException("Unknown question type");
    }

    return sql`json_build_object(${sql.raw(handler(answers).join(","))})`;

    // TODO: decide how handle lesson progress
    // await this.studentLessonProgressService.markLessonAsCompleted(questionData.lessonId, userId);

    // const [studentLessonProgress] = await this.lessonRepository.updateStudentLessonProgress(
    //   userId,
    //   questionData.lessonId,
    //   answerQuestion.courseId,
    // );

    // if (
    //   !quizProgress?.completedAt &&
    //   studentLessonProgress?.completedLessonItemCount === lesson.itemsCount
    // ) {
    //   const isCompletedFreemiumLesson = lesson.isFree && !lesson.enrolled;

    //   await this.lessonRepository.completeLessonProgress(
    //     answerQuestion.courseId,
    //     questionData.lessonId,
    //     userId,
    //     isCompletedFreemiumLesson,
    //     trx,
    //   );

    //   const existingLessonProgress = await this.lessonRepository.getLessonsProgressByCourseId(
    //     answerQuestion.courseId,
    //     trx,
    //   );

    //   if (isCompletedFreemiumLesson && existingLessonProgress.length === 0) {
    //     await this.statisticsRepository.updateCompletedAsFreemiumCoursesStats(userId, trx);
    //   }
    // }
    // });
  }

  private handleChoiceAnswer(
    answers: {
      index: number;
      value: string;
    }[],
  ) {
    return answers.reduce((acc, answer, index) => {
      acc.push(`'${index}'`, `'${answer.value}'`);
      return acc;
    }, [] as string[]);
  }

  private handleFillInTheBlanksAnswer(
    answers: {
      index: number;
      value: string;
    }[],
  ) {
    return answers.reduce((acc, answer) => {
      if (typeof answer === "string") return acc;

      acc.push(`'${answer.index}'`, `'${answer.value}'`);
      return acc;
    }, [] as string[]);
  }

  private handleOpenAnswer(
    answers: {
      index: number;
      value: string;
    }[],
  ) {
    return [`'1'`, `'${answers[0].value}'`];
  }
}
