import { ConflictException, Inject, Injectable } from "@nestjs/common";
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
    correctAnswersForQuizQuestions: {
      id: string;
      type: QuestionTypes;
      correctAnswers: { answerId: UUIDType; displayOrder: number; value: string }[];
      allAnswers: { answerId: UUIDType; displayOrder: number; value: string; isCorrect: boolean }[];
    }[],
    studentQuizAnswers: AnswerQuestionBody,
    userId: UUIDType,
    trx: PostgresJsDatabase<typeof schema>,
  ) {
    const quizEvaluationStats = correctAnswersForQuizQuestions.reduce(
      (quizStats, question) => {
        const questionAnswerList = studentQuizAnswers.answers.filter(
          (answer) => answer.questionId === question.id,
        );

        if (questionAnswerList.length !== 1) throw new Error("Answer is not valid");

        const questionAnswer = questionAnswerList[0];
        const passQuestion = match(question.type)
          .returnType<boolean>()
          .with(
            QUESTION_TYPE.fill_in_the_blanks_text.key,
            QUESTION_TYPE.fill_in_the_blanks_dnd.key,
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
          .with(QUESTION_TYPE.brief_response.key, QUESTION_TYPE.detailed_response.key, () => {
            // TODO: implement this

            return true;
          })
          .with(QUESTION_TYPE.single_choice.key, () => {
            let passQuestion = true;
            if (question.correctAnswers.length !== questionAnswer.answer.length) {
              throw new ConflictException(
                question.id,
                "Single choice question has only one answer",
              );
            }

            if (question.correctAnswers[0].answerId !== questionAnswer.answer[0].answerId) {
              passQuestion = false;
            }

            return passQuestion;
          })
          .with(QUESTION_TYPE.multiple_choice.key, () => {
            let passQuestion = true;

            if (question.correctAnswers.length !== questionAnswer.answer.length) {
              return false;
            }

            for (const correctAnswer of question.correctAnswers) {
              const studentAnswer = questionAnswer.answer.filter(
                (answer) => answer.answerId === correctAnswer.answerId,
              );

              if (studentAnswer.length !== 1) {
                passQuestion = false;
                break;
              }
            }

            return passQuestion;
          })
          .with(QUESTION_TYPE.true_or_false.key, () => {
            let passQuestion = true;
            if (question.allAnswers.length !== questionAnswer.answer.length) {
              throw new ConflictException(
                question.id,
                "Too many answers for true or false question",
              );
            }

            for (const answer of question.allAnswers) {
              const studentAnswer = questionAnswer.answer.filter(
                (answerOption) => answerOption.answerId === answer.answerId,
              );

              const answerValueToString = studentAnswer[0].value === true.toString();

              if (studentAnswer.length !== 1 || answerValueToString !== answer.isCorrect) {
                passQuestion = false;
                break;
              }
            }

            return passQuestion;
          })
          .with(QUESTION_TYPE.photo_question.key, () => {
            // TODO: add new types for this case
            let passQuestion = true;

            if (question.correctAnswers.length !== questionAnswer.answer.length) {
              return false;
            }

            for (const correctAnswer of question.correctAnswers) {
              const studentAnswer = questionAnswer.answer.filter(
                (answer) => answer.answerId === correctAnswer.answerId,
              );

              if (studentAnswer.length !== 1) {
                passQuestion = false;
                break;
              }
            }

            return passQuestion;
          })
          .with(QUESTION_TYPE.match_words.key, () => {
            let passQuestion = true;

            for (const correctAnswer of question.correctAnswers) {
              const studentAnswer = questionAnswer.answer.filter(
                (answer) => answer.answerId === correctAnswer.answerId,
              );

              if (studentAnswer.length !== 1) {
                passQuestion = false;
                break;
              }
            }

            return passQuestion;
          })
          .with(QUESTION_TYPE.scale_1_5.key, () => {
            // TODO: implement this
            return true;
          })
          .otherwise(() => {
            // TODO: add error handling

            return false;
          });

        const answersToRecord =
          question.type === QUESTION_TYPE.brief_response.key ||
          question.type === QUESTION_TYPE.detailed_response.key
            ? [questionAnswer.answer[0]?.value || ""]
            : question.allAnswers.map((answerOption) => {
                if (
                  questionAnswer.answer.find((answer) => answer.answerId === answerOption.answerId)
                ) {
                  return answerOption.value;
                }
                // TODO: handle it, when value is not found
                return "";
              });

        const formattedAnswer = this.questionAnswerToString(answersToRecord);

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
  }

  private questionAnswerToString(answers: string[]): SQL<unknown> {
    const convertedAnswers = answers.reduce((acc, answer, index) => {
      acc.push(`'${index + 1}'`, `'${answer}'`);
      return acc;
    }, [] as string[]);

    return sql`json_build_object(${sql.raw(convertedAnswers.join(","))})`;

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
}
