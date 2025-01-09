import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { and, desc, eq, sql } from "drizzle-orm";
import { isNumber } from "lodash";

import { DatabasePg } from "src/common";
import { QuizCompletedEvent } from "src/events";
import { FileService } from "src/file/file.service";
import { QuestionRepository } from "src/questions/question.repository";
import { QuestionService } from "src/questions/question.service";
import { QUESTION_TYPE } from "src/questions/schema/question.types";
import {
  questionAnswerOptions,
  questions,
  quizAttempts,
  studentQuestionAnswers,
} from "src/storage/schema";
import { StudentLessonProgressService } from "src/studentLessonProgress/studentLessonProgress.service";

import { LESSON_TYPES } from "../lesson.type";
import { LessonRepository } from "../repositories/lesson.repository";

import type {
  AnswerQuestionBody,
  LessonShow,
  OptionBody,
  QuestionBody,
  QuestionDetails,
} from "../lesson.schema";
import type { UUIDType } from "src/common";
import type { QuestionType } from "src/questions/schema/question.types";

@Injectable()
export class LessonService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly lessonRepository: LessonRepository,
    private readonly questionService: QuestionService,
    private readonly questionRepository: QuestionRepository,
    private readonly fileService: FileService,
    private readonly studentLessonProgressService: StudentLessonProgressService,
    private readonly eventBus: EventBus,
  ) {}

  async getLessonById(id: UUIDType, userId: UUIDType, isStudent: boolean): Promise<LessonShow> {
    const lesson = await this.lessonRepository.getLessonDetails(id, userId);

    if (!lesson) throw new NotFoundException("Lesson not found");

    if (!lesson.isFreemium && !lesson.isEnrolled)
      throw new UnauthorizedException("You don't have access");

    if (lesson.type === LESSON_TYPES.TEXT && !lesson.fileUrl) return lesson;

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
        id: sql<UUIDType>`${questions.id}`,
        type: sql<QuestionType>`${questions.type}`,
        title: questions.title,
        description: sql<string>`${questions.description}`,
        solutionExplanation: sql<string | null>`CASE
          WHEN ${lesson.quizCompleted} THEN ${questions.solutionExplanation} 
          ELSE NULL 
        END`,
        photoS3Key: sql<string>`${questions.photoS3Key}`,
        passQuestion: sql<boolean | null>`CASE
          WHEN ${lesson.quizCompleted} THEN ${studentQuestionAnswers.isCorrect}
          ELSE NULL END`,
        displayOrder: sql<number>`${questions.displayOrder}`,
        options: sql<OptionBody[]>`CASE
          WHEN ${questions.type} in (${QUESTION_TYPE.BRIEF_RESPONSE}, ${
            QUESTION_TYPE.DETAILED_RESPONSE
          }) AND ${lesson.quizCompleted} THEN
            ARRAY[json_build_object(
              'id', ${studentQuestionAnswers.id},
              'optionText', '',
              'isCorrect', TRUE,
              'displayOrder', 1,
              'isStudentAnswer', TRUE,
              'studentAnswer', ${studentQuestionAnswers.answer}->>'1',
              'solutionExplanation', NULL
            )]
          ELSE
          (
            SELECT ARRAY(
              SELECT json_build_object(
                'id', qao.id,
                'optionText',  
                  CASE 
                    WHEN ${!lesson.quizCompleted} AND ${questions.type} = ${
                      QUESTION_TYPE.FILL_IN_THE_BLANKS_TEXT
                    } THEN NULL
                    ELSE qao.option_text
                  END,
                'isCorrect', CASE WHEN ${lesson.quizCompleted} THEN qao.is_correct ELSE NULL END,
                'displayOrder',
                  CASE
                    WHEN ${lesson.quizCompleted} THEN qao.display_order
                    ELSE NULL
                  END,
                'isStudentAnswer',
                  CASE
                    WHEN ${studentQuestionAnswers.id} IS NULL THEN NULL
                    WHEN ${
                      studentQuestionAnswers.answer
                    }->>CAST(qao.display_order AS text) = qao.option_text AND
                      ${questions.type} IN (${QUESTION_TYPE.FILL_IN_THE_BLANKS_DND}, ${
                        QUESTION_TYPE.FILL_IN_THE_BLANKS_TEXT
                      })
                      THEN TRUE
                    WHEN EXISTS (
                      SELECT 1
                      FROM jsonb_object_keys(${studentQuestionAnswers.answer}) AS key
                      WHERE ${studentQuestionAnswers.answer}->key = to_jsonb(qao.option_text))
                        AND  ${questions.type} NOT IN (${QUESTION_TYPE.FILL_IN_THE_BLANKS_DND}, ${
                          QUESTION_TYPE.FILL_IN_THE_BLANKS_TEXT
                        })
                      THEN TRUE
                    ELSE FALSE
                  END,
                'studentAnswer',  
                  CASE
                    WHEN ${studentQuestionAnswers.id} IS NULL THEN NULL
                    ELSE ${studentQuestionAnswers.answer}->>CAST(qao.display_order AS text)
                  END,
                'solutionExplanation',
                  CASE
                    WHEN ${studentQuestionAnswers.id} IS NULL THEN NULL
                    ELSE ${questions.type} in (${QUESTION_TYPE.FILL_IN_THE_BLANKS_DND}, ${
                      QUESTION_TYPE.FILL_IN_THE_BLANKS_TEXT
                    })
                  END
              )
              FROM ${questionAnswerOptions} qao
              WHERE qao.question_id = questions.id
              ORDER BY
                CASE
                  WHEN ${questions.type} in (${
                    QUESTION_TYPE.FILL_IN_THE_BLANKS_DND
                  }) AND ${!lesson.quizCompleted}
                    THEN random()
                  ELSE qao.display_order
                END
            )
          )
        END
      `,
      })
      .from(questions)
      .leftJoin(
        studentQuestionAnswers,
        and(
          eq(studentQuestionAnswers.questionId, questions.id),
          eq(studentQuestionAnswers.studentId, userId),
        ),
      )
      .where(eq(questions.lessonId, id))
      .orderBy(questions.displayOrder);

    const questionListWithUrls: QuestionBody[] = await Promise.all(
      questionList.map(async (question) => {
        if (question.photoS3Key) {
          if (question.photoS3Key.startsWith("https://")) return question;

          try {
            const signedUrl = await this.fileService.getFileUrl(question.photoS3Key);
            return { ...question, photoS3Key: signedUrl };
          } catch (error) {
            console.error(`Failed to get signed URL for ${question.photoS3Key}:`, error);
            return question;
          }
        }
        return question;
      }),
    );

    if (isStudent && lesson.quizCompleted && isNumber(lesson.quizScore)) {
      const [quizResult] = await this.db
        .select({
          score: sql<number>`${quizAttempts.score}`,
          correctAnswerCount: sql<number>`${quizAttempts.correctAnswers}`,
          wrongAnswerCount: sql<number>`${quizAttempts.wrongAnswers}`,
        })
        .from(quizAttempts)
        .where(
          and(
            eq(quizAttempts.lessonId, id),
            eq(quizAttempts.userId, userId),
            eq(quizAttempts.score, lesson.quizScore),
          ),
        )
        .orderBy(desc(quizAttempts.createdAt))
        .limit(1);

      const quizDetails: QuestionDetails = {
        questions: questionListWithUrls,
        questionCount: questionListWithUrls.length,
        score: quizResult?.score ?? 0,
        correctAnswerCount: quizResult?.correctAnswerCount ?? 0,
        wrongAnswerCount: quizResult?.wrongAnswerCount ?? 0,
      };

      return { ...lesson, quizDetails };
    }

    const quizDetails = {
      questions: questionListWithUrls,
      questionCount: questionListWithUrls.length,
      score: null,
      correctAnswerCount: null,
      wrongAnswerCount: null,
    };

    return { ...lesson, quizDetails };
  }

  async evaluationQuiz(
    studentQuizAnswers: AnswerQuestionBody,
    userId: UUIDType,
  ): Promise<{
    correctAnswerCount: number;
    wrongAnswerCount: number;
    questionCount: number;
    score: number;
  }> {
    const [accessCourseLessonWithDetails] = await this.lessonRepository.checkLessonAssignment(
      studentQuizAnswers.lessonId,
      userId,
    );

    if (!accessCourseLessonWithDetails.isAssigned && !accessCourseLessonWithDetails.isFreemium)
      throw new UnauthorizedException("You don't have assignment to this lesson");

    if (accessCourseLessonWithDetails.lessonIsCompleted)
      throw new ConflictException("Quiz already finished");

    const correctAnswersForQuizQuestions =
      await this.questionRepository.getQuizQuestionsToEvaluation(studentQuizAnswers.lessonId);

    if (correctAnswersForQuizQuestions.length !== studentQuizAnswers.answers.length) {
      throw new ConflictException("Quiz is not completed");
    }

    return await this.db.transaction(async (trx) => {
      try {
        const evaluationResult = await this.questionService.evaluationsQuestions(
          correctAnswersForQuizQuestions,
          studentQuizAnswers,
          userId,
          trx,
        );

        const quizScore = Math.round(
          (evaluationResult.correctAnswerCount /
            (evaluationResult.correctAnswerCount + evaluationResult.wrongAnswerCount)) *
            100,
        );

        await this.lessonRepository.completeQuiz(
          accessCourseLessonWithDetails.chapterId,
          studentQuizAnswers.lessonId,
          userId,
          evaluationResult.correctAnswerCount + evaluationResult.wrongAnswerCount,
          quizScore,
          trx,
        );

        await this.studentLessonProgressService.markLessonAsCompleted(
          studentQuizAnswers.lessonId,
          userId,
          true,
          evaluationResult.correctAnswerCount + evaluationResult.wrongAnswerCount,
          trx,
        );

        this.eventBus.publish(
          new QuizCompletedEvent(
            userId,
            accessCourseLessonWithDetails.courseId,
            studentQuizAnswers.lessonId,
            evaluationResult.correctAnswerCount,
            evaluationResult.wrongAnswerCount,
            quizScore,
          ),
        );

        return {
          correctAnswerCount: evaluationResult.correctAnswerCount,
          wrongAnswerCount: evaluationResult.wrongAnswerCount,
          questionCount: evaluationResult.wrongAnswerCount + evaluationResult.correctAnswerCount,
          score: quizScore,
        };
      } catch (error) {
        throw new ConflictException(
          "Quiz evaluation failed, problem with question: " +
            error.message +
            " problem: " +
            error.response.error,
        );
      }
    });
  }

  // async studentAnswerOnQuestion(
  //   questionId: UUIDType,
  //   studentId: UUIDType,
  //   isCorrect: boolean,
  //   trx?: PostgresJsDatabase<typeof schema>,
  // ) {
  //   await this.db.insert(studentQuestionAnswers).values({
  //     questionId,
  //     studentId,
  //     answer: isCorrect,
  //   });
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
}
