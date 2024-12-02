import { StripeWebhookHandler as StripeWebhookHandlerDecorator } from "@golevelup/nestjs-stripe";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";

import { DatabasePg } from "src/common";
import { STATES } from "src/common/states";
import { LESSON_TYPE } from "src/lessons/lesson.type";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import {
  courseLessons,
  courses,
  lessonItems,
  lessons,
  studentCourses,
  studentLessonsProgress,
  users,
} from "src/storage/schema";

@Injectable()
export class StripeWebhookHandler {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly statisticsRepository: StatisticsRepository,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  @StripeWebhookHandlerDecorator("payment_intent.succeeded")
  async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.customerId;
    const courseId = paymentIntent.metadata.courseId;

    if (!userId && !courseId) return null;

    const [user] = await this.db.select().from(users).where(eq(users.id, userId));

    if (!user) return null;

    const [course] = await this.db.select().from(courses).where(eq(courses.id, courseId));

    if (!course) return null;

    const [payment] = await this.db
      .insert(studentCourses)
      .values({
        studentId: user.id,
        courseId: course.id,
        paymentId: paymentIntent.id,
      })
      .returning();

    if (!payment) return null;

    await this.db.transaction(async (trx) => {
      const courseLessonList = await trx
        .select({
          id: lessons.id,
          lessonType: lessons.type,
          itemCount: lessons.itemsCount,
        })
        .from(courseLessons)
        .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
        .leftJoin(lessonItems, eq(lessons.id, lessonItems.lessonId))
        .where(
          and(
            eq(courseLessons.courseId, course.id),
            eq(lessons.archived, false),
            eq(lessons.state, STATES.published),
          ),
        )
        .groupBy(lessons.id);

      if (courseLessonList.length > 0) {
        await trx.insert(studentLessonsProgress).values(
          courseLessonList.map((lesson) => ({
            studentId: userId,
            lessonId: lesson.id,
            courseId: course.id,
            quizCompleted: lesson.lessonType === LESSON_TYPE.quiz.key ? false : null,
            quizScore: lesson.lessonType === LESSON_TYPE.quiz.key ? 0 : null,
            completedLessonItemCount: 0,
          })),
        );
      }
      const existingLessonProgress = await this.lessonsRepository.getLessonsProgressByCourseId(
        course.id,
        trx,
      );

      switch (existingLessonProgress.length) {
        case 0:
          return await this.statisticsRepository.updatePaidPurchasedCoursesStats(course.id, trx);
        default:
          return await this.statisticsRepository.updatePaidPurchasedAfterFreemiumCoursesStats(
            course.id,
            trx,
          );
      }
    });

    return true;
  }
}
