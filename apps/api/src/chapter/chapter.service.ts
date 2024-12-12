import { Inject, Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";

import { DatabasePg } from "src/common";
import { FileService } from "src/file/file.service";

import { ChapterRepository } from "./repositories/chapter.repository";

@Injectable()
export class ChapterService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly fileService: FileService,
    private readonly chapterRepository: ChapterRepository,
    private readonly eventBus: EventBus,
  ) {}

  // async getChapter(
  //   id: UUIDType,
  //   userId: UUIDType,
  //   isAdmin?: boolean,
  // ): Promise<ShowChapterResponse> {
  //   const [courseAccess] = await this.chapterRepository.checkChapterAssignment(id, userId);
  //   const chapter = await this.chapterRepository.getChapterForUser(id, userId);

  //   if (!isAdmin && !courseAccess && !chapter.isFreemium)
  //     throw new UnauthorizedException("You don't have access to this lesson");

  //   if (!chapter) throw new NotFoundException("Lesson not found");

  //   // const chapterProgress = await this.chapterRepository.getChapterProgressForStudent(
  //   //   chapter.id,
  //   //   userId,
  //   // );

  //   // if (lesson.type !== LESSON_TYPE.quiz.key) {
  //   //   const lessonItems = await this.getLessonItems(chapter.id, courseId, userId);

  //   //   const completableLessonItems = lessonItems.filter(
  //   //     (item) => item.lessonItemType !== LESSON_ITEM_TYPE.text_block.key,
  //   //   );

  //   //   return {
  //   //     ...lesson,
  //   //     imageUrl,
  //   //     lessonItems: lessonItems,
  //   //     lessonProgress:
  //   //       completableLessonItems.length === 0
  //   //         ? ChapterProgress.notStarted
  //   //         : completableLessonItems.length > 0
  //   //         ? ChapterProgress.inProgress
  //   //         : ChapterProgress.completed,
  //   //     itemsCompletedCount: completedLessonItems.length,
  //   //   };
  //   // }

  //   // const lessonProgress = await this.chapterRepository.lessonProgress(
  //   //   courseId,
  //   //   lesson.id,
  //   //   userId,
  //   //   true,
  //   // );

  //   // if (!lessonProgress && !isAdmin && !lesson.isFree)
  //   //   throw new NotFoundException("Lesson progress not found");

  //   // const isAdminOrFreeLessonWithoutLessonProgress = (isAdmin || lesson.isFree) && !lessonProgress;

  //   // const questionLessonItems = await this.getLessonQuestions(
  //   //   lesson,
  //   //   courseId,
  //   //   userId,
  //   //   isAdminOrFreeLessonWithoutLessonProgress ? false : lessonProgress.quizCompleted,
  //   // );

  //   return chapter;
  // }
}
