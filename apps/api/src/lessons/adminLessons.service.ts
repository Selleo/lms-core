import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { DatabasePg } from "src/common";
import { match, P } from "ts-pattern";
import { LessonItemResponse } from "./schemas/lessonItem.schema";
import { isEmpty } from "lodash";
import { S3Service } from "src/file/s3.service";
import { CreateLessonBody, UpdateLessonBody } from "./schemas/lesson.schema";
import { AdminLessonsRepository } from "./repositories/adminLessons.repository";

@Injectable()
export class AdminLessonsService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly s3Service: S3Service,
    private readonly adminLessonsRepository: AdminLessonsRepository,
  ) {}

  async getAllLessons() {
    const lessonsData = await this.adminLessonsRepository.getLessons();

    return Promise.all(
      lessonsData.map(async (lesson) => ({
        ...lesson,
        imageUrl: lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl),
      })),
    );
  }

  async getLessonById(id: string) {
    const lesson = await this.adminLessonsRepository.getLessonById(id);

    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessonItemsList =
      await this.adminLessonsRepository.getLessonItems(id);

    const items = await Promise.all(
      lessonItemsList.map(async (item) => {
        const content = await match(item)
          .returnType<Promise<LessonItemResponse["content"]>>()
          .with(
            { lessonItemType: "question", questionData: P.not(P.nullish) },
            async (item) => {
              const questionAnswers =
                await this.adminLessonsRepository.getQuestionAnswers(
                  item.questionData.id,
                );

              return {
                id: item.questionData.id,
                questionType: item.questionData.questionType,
                questionBody: item.questionData.questionBody,
                questionAnswers,
                state: item.questionData.state,
              };
            },
          )
          .with(
            { lessonItemType: "text_block", textBlockData: P.not(P.nullish) },
            async (item) => ({
              id: item.textBlockData.id,
              body: item.textBlockData.body || "",
              state: item.textBlockData.state,
              title: item.textBlockData.title,
            }),
          )
          .with(
            { lessonItemType: "file", fileData: P.not(P.nullish) },
            async (item) => ({
              id: item.fileData.id,
              title: item.fileData.title,
              type: item.fileData.type,
              url: item.fileData.url,
              state: item.fileData.state,
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
      }),
    );

    return {
      ...lesson,
      lessonItems: items,
      itemsCount: items.length,
    };
  }

  async getAvailableLessons() {
    const availableLessons =
      await this.adminLessonsRepository.getAvailableLessons();

    if (isEmpty(availableLessons))
      throw new NotFoundException("No lessons found");

    return await Promise.all(
      availableLessons.map(async (lesson) => {
        const imageUrl = lesson.imageUrl.startsWith("https://")
          ? lesson.imageUrl
          : await this.s3Service.getSignedUrl(lesson.imageUrl);
        return { ...lesson, imageUrl };
      }),
    );
  }

  async createLesson(body: CreateLessonBody, authorId: string) {
    const [lesson] = await this.adminLessonsRepository.createLesson(
      body,
      authorId,
    );

    if (!lesson) throw new NotFoundException("Lesson not found");
  }

  async updateLesson(id: string, body: UpdateLessonBody) {
    const [lesson] = await this.adminLessonsRepository.updateLesson(id, body);

    if (!lesson) throw new NotFoundException("Lesson not found");
  }

  async addLessonToCourse(
    courseId: string,
    lessonId: string,
    displayOrder?: number,
  ) {
    try {
      if (displayOrder === undefined) {
        const maxOrderResult =
          await this.adminLessonsRepository.getMaxOrderLessonsInCourse(
            courseId,
          );

        displayOrder = maxOrderResult + 1;
      }

      await this.adminLessonsRepository.assignLessonToCourse(
        courseId,
        lessonId,
        displayOrder,
      );
    } catch (error) {
      if (error.code === "23505") {
        // postgres uniq error code
        throw new ConflictException(
          "This lesson is already added to the course",
        );
      }
      throw error;
    }
  }

  async removeLessonFromCourse(courseId: string, lessonId: string) {
    const result = await this.adminLessonsRepository.removeCourseLesson(
      courseId,
      lessonId,
    );

    if (result.length === 0) {
      throw new NotFoundException("Lesson not found in this course");
    }

    await this.adminLessonsRepository.updateDisplayOrderLessonsInCourse(
      courseId,
      lessonId,
    );
  }
}
