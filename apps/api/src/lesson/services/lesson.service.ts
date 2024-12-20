import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";

import type { UUIDType } from "src/common";
import { lessons, questionAnswerOptions, questions } from "src/storage/schema";
import { LESSON_TYPES, PhotoQuestionType, QuestionType } from "../lesson.type";
import { FileService } from "src/file/file.service";
import { LessonShow, OptionBody, QuestionBody } from "../lesson.schema";
import { QuestionTypes } from "src/questions/schema/questions.types";

@Injectable()
export class LessonService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly fileService: FileService, // TODO: add event bus
  ) // private readonly eventBus: EventBus,
  {}

  async getLessonById(id: UUIDType): Promise<LessonShow> {
    const [lesson] = await this.db
      .select({
        id: lessons.id,
        type: lessons.type,
        title: lessons.title,
        description: sql<string>`${lessons.description}`,
        fileUrl: lessons.fileS3Key,
        fileType: lessons.fileType,
      })
      .from(lessons)
      .where(eq(lessons.id, id));

    if (!lesson) throw new NotFoundException("Lesson not found");

    if (lesson.type === LESSON_TYPES.TEXT_BLOCK && !lesson.fileUrl) return lesson;

    if (lesson.type !== LESSON_TYPES.QUIZ) {
      if (!lesson.fileUrl) throw new NotFoundException("Lesson file not found");

      if (lesson.fileUrl.startsWith("https://")) return lesson;

      try {
        const signedUrl = await this.fileService.getFileUrl(lesson.fileUrl);
        return { ...lesson, fileUrl: signedUrl };
      } catch (error) {
        console.error(`Failed to get signed URL for ${lesson.fileUrl}:`, error);
        throw new NotFoundException("Lesson file not found");
      }
    }

    const questionList: QuestionBody[] = await this.db
      .select({
        id: questions.id,
        type: sql<QuestionType>`${questions.type}`,
        title: questions.title,
        description: sql<string>`${questions.description}`,
        photoS3Key: sql<string | undefined>`COALESCE(${questions.photoS3Key}, undefined)`,
        photoQuestionType: sql<PhotoQuestionType | undefined>`COALESCE(
          ${questions.photoQuestionType}, undefined
        )`,
        options: sql<OptionBody[]>`
                  COALESCE(
                    (
                      SELECT json_agg(question_options)
                      FROM (
                        SELECT
                          ${questionAnswerOptions.id} AS id,
                          ${questionAnswerOptions.optionText} AS optionText,
                          ${questionAnswerOptions.isCorrect} AS "isCorrect",
                          ${questionAnswerOptions.position} AS "position",
                        FROM ${questionAnswerOptions}
                        WHERE ${questionAnswerOptions.questionId} = ${questions.id}
                        GROUP BY
                          ${questionAnswerOptions.id},
                          ${questionAnswerOptions.optionText},
                          ${questionAnswerOptions.isCorrect},
                          ${questionAnswerOptions.position},
                        ORDER BY ${questionAnswerOptions.position}
                      ) AS question_options
                    ),
                    undefined
                  )
                `,
      })
      .from(questions)
      .where(eq(questions.lessonId, id));

    const quizDetails = {
      questions: questionList,
      questionCount: questionList.length,
      score: 1,
      correctAnswerCount: 1,
      wrongAnswerCount: 1,
    };
    return { ...lesson, quizDetails };
  }

  // async evaluationQuiz(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //   const [accessCourseLessons] = await this.chapterRepository.checkLessonAssignment(
  //     courseId,
  //     lessonId,
  //     userId,
  //   );

  //   if (!accessCourseLessons.isAssigned && !accessCourseLessons.isFree)
  //     throw new UnauthorizedException("You don't have assignment to this lesson");

  //   const quizProgress = await this.chapterRepository.getQuizProgress(courseId, lessonId, userId);

  //   if (quizProgress?.quizCompleted) throw new ConflictException("Quiz already completed");

  //   const lessonItemsCount = await this.chapterRepository.getLessonItemCount(lessonId);

  //   const completedLessonItemsCount = await this.chapterRepository.completedLessonItemsCount(
  //     courseId,
  //     lessonId,
  //   );

  //   if (lessonItemsCount.count !== completedLessonItemsCount.count)
  //     throw new ConflictException("Lesson is not completed");

  //   const evaluationResult = await this.evaluationsQuestions(courseId, lessonId, userId);

  //   if (!evaluationResult) return false;

  //   const quizScore = await this.chapterRepository.getQuizScore(courseId, lessonId, userId);

  //   const updateQuizResult = await this.chapterRepository.completeQuiz(
  //     courseId,
  //     lessonId,
  //     userId,
  //     completedLessonItemsCount.count,
  //     quizScore,
  //   );

  //   if (!updateQuizResult) return false;

  //   return true;
  // }

  // private async evaluationsQuestions(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //   const lesson = await this.chapterRepository.getLessonForUser(courseId, lessonId, userId);
  //   const questionLessonItems = await this.getLessonQuestionsToEvaluation(
  //     lesson,
  //     courseId,
  //     userId,
  //     true,
  //   );

  //   try {
  //     await this.db.transaction(async (trx) => {
  //       await Promise.all(
  //         questionLessonItems.map(async (questionLessonItem) => {
  //           const answers = await this.chapterRepository.getQuestionAnswers(
  //             questionLessonItem.content.id,
  //             userId,
  //             courseId,
  //             lessonId,
  //             lesson.type,
  //             true,
  //             trx,
  //           );

  //           const passQuestion = await match(questionLessonItem.content.questionType)
  //             .returnType<Promise<boolean>>()
  //             .with(QUESTION_TYPE.fill_in_the_blanks_text.key, async () => {
  //               const question = questionLessonItem.content;
  //               let passQuestion = true;

  //               for (const answer of question.questionAnswers) {
  //                 if (answer.optionText != answer.studentAnswerText) {
  //                   passQuestion = false;
  //                   break;
  //                 }
  //               }

  //               return passQuestion;
  //             })
  //             .with(QUESTION_TYPE.fill_in_the_blanks_dnd.key, async () => {
  //               const question = questionLessonItem.content;
  //               let passQuestion = true;

  //               for (const answer of question.questionAnswers) {
  //                 if (answer.isStudentAnswer != answer.isCorrect) {
  //                   passQuestion = false;
  //                   break;
  //                 }
  //               }

  //               return passQuestion;
  //             })
  //             .otherwise(async () => {
  //               let passQuestion = true;
  //               for (const answer of answers) {
  //                 if (
  //                   answer.isStudentAnswer !== answer.isCorrect ||
  //                   isNull(answer.isStudentAnswer)
  //                 ) {
  //                   passQuestion = false;
  //                   break;
  //                 }
  //               }

  //               return passQuestion;
  //             });

  //           await this.chapterRepository.setCorrectAnswerForStudentAnswer(
  //             courseId,
  //             lessonId,
  //             questionLessonItem.content.id,
  //             userId,
  //             passQuestion,
  //             trx,
  //           );
  //         }),
  //       );
  //     });

  //     const correctAnswers = await this.chapterRepository.getQuizQuestionsAnswers(
  //       courseId,
  //       lessonId,
  //       userId,
  //       true,
  //     );
  //     const correctAnswerCount = correctAnswers.length;
  //     const totalQuestions = questionLessonItems.length;
  //     const wrongAnswerCount = totalQuestions - correctAnswerCount;
  //     const score = Math.round((correctAnswerCount / totalQuestions) * 100);

  //     this.eventBus.publish(
  //       new QuizCompletedEvent(
  //         userId,
  //         courseId,
  //         lessonId,
  //         correctAnswerCount,
  //         wrongAnswerCount,
  //         score,
  //       ),
  //     );

  //     return true;
  //   } catch (error) {
  //     console.log("error", error);
  //     return false;
  //   }
  // }

  // async clearQuizProgress(courseId: UUIDType, lessonId: UUIDType, userId: UUIDType) {
  //   const [accessCourseLessons] = await this.chapterRepository.checkLessonAssignment(
  //     courseId,
  //     lessonId,
  //     userId,
  //   );

  //   if (!accessCourseLessons)
  //     throw new UnauthorizedException("You don't have assignment to this lesson");

  //   const quizProgress = await this.chapterRepository.lessonProgress(
  //     courseId,
  //     lessonId,
  //     userId,
  //     true,
  //   );

  //   if (!quizProgress) throw new NotFoundException("Lesson progress not found");

  //   try {
  //     return await this.db.transaction(async (trx) => {
  //       const questionIds = await this.chapterRepository.getQuestionsIdsByLessonId(lessonId);

  //       await this.chapterRepository.retireQuizProgress(courseId, lessonId, userId, trx);

  //       await this.chapterRepository.removeQuestionsAnswer(
  //         courseId,
  //         lessonId,
  //         questionIds,
  //         userId,
  //         trx,
  //       );

  //       await this.chapterRepository.removeStudentCompletedLessonItems(
  //         courseId,
  //         lessonId,
  //         userId,
  //         trx,
  //       );

  //       return true;
  //     });
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // private async getLessonQuestionsToEvaluation(
  //   lesson: Lesson,
  //   courseId: UUIDType,
  //   userId: UUIDType,
  //   quizCompleted: boolean,
  // ) {
  //   const lessonItemsList = await this.chapterRepository.getLessonItems(lesson.id, courseId);
  //   const validLessonItemsList = lessonItemsList.filter(this.isValidItem);

  //   return await Promise.all(
  //     validLessonItemsList.map(async (item) => {
  //       const { lessonItemId, questionData, lessonItemType, displayOrder } = item;

  //       if (isNull(questionData)) throw new Error("Question not found");

  //       const content = await this.processQuestionItem(
  //         { lessonItemId, displayOrder, lessonItemType, questionData },
  //         userId,
  //         courseId,
  //         lesson.id,
  //         lesson.type,
  //         quizCompleted,
  //         null,
  //       );

  //       return {
  //         lessonItemId: item.lessonItemId,
  //         lessonItemType: item.lessonItemType,
  //         displayOrder: item.displayOrder,
  //         content,
  //       };
  //     }),
  //   );
  // }
}
