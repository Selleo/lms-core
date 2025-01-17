import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { isNumber } from "lodash";

import { DatabasePg } from "src/common";
import { QuizCompletedEvent } from "src/events";
import { FileService } from "src/file/file.service";
import { QuestionRepository } from "src/questions/question.repository";
import { QuestionService } from "src/questions/question.service";
import { StudentLessonProgressService } from "src/studentLessonProgress/studentLessonProgress.service";

import { LESSON_TYPES } from "../lesson.type";
import { LessonRepository } from "../repositories/lesson.repository";

import type {
  AnswerQuestionBody,
  LessonShow,
  QuestionBody,
  QuestionDetails,
} from "../lesson.schema";
import type { UUIDType } from "src/common";

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

    const questionList = await this.questionRepository.getQuestionsForLesson(
      lesson.id,
      lesson.lessonCompleted,
      userId,
    );

    const questionListWithUrls: QuestionBody[] = await Promise.all(
      questionList.map(async (question) => {
        if (!question.photoS3Key) return question;

        try {
          const signedUrl = await this.fileService.getFileUrl(question.photoS3Key);

          return { ...question, photoS3Key: signedUrl };
        } catch (error) {
          console.error(`Failed to get signed URL for ${question.photoS3Key}:`, error);
          return question;
        }
      }),
    );

    if (isStudent && lesson.lessonCompleted && isNumber(lesson.quizScore)) {
      const [quizResult] = await this.lessonRepository.getQuizResult(
        lesson.id,
        lesson.quizScore,
        userId,
      );

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

    if (correctAnswersForQuizQuestions.length !== studentQuizAnswers.questionsAnswers.length) {
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
          undefined,
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
            error?.message +
            " problem is: " +
            error?.response?.error,
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
