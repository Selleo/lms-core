import { StripeWebhookHandler as StripeWebhookHandlerDecorator } from "@golevelup/nestjs-stripe";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { isEmpty } from "lodash";
import Stripe from "stripe";

import { DatabasePg } from "src/common";

import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";
import {
  chapters,
  courses,
  lessons,
  studentChapterProgress,
  studentCourses,
  users,
} from "src/storage/schema";
import { LessonRepository } from "src/lesson/lesson.repository";

@Injectable()
export class StripeWebhookHandler {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly statisticsRepository: StatisticsRepository,
    private readonly lessonRepository: LessonRepository,
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
      const courseChapterList = await trx
        .select({
          id: chapters.id,
          type: lessons.type,
          itemCount: chapters.lessonCount,
        })
        .from(chapters)
        .leftJoin(lessons, eq(lessons.chapterId, chapters.id))
        .where(and(eq(chapters.courseId, course.id), eq(chapters.isPublished, true)))
        .groupBy(chapters.id);

      if (courseChapterList.length > 0) {
        await trx.insert(studentChapterProgress).values(
          courseChapterList.map((chapter) => ({
            studentId: userId,
            chapterId: chapter.id,
            courseId: course.id,
            completedLessonItemCount: 0,
          })),
        );
      }
      const existingLessonProgress = await this.lessonRepository.getLessonsProgressByCourseId(
        course.id,
        userId,
        trx,
      );

      return isEmpty(existingLessonProgress)
        ? await this.statisticsRepository.updatePaidPurchasedCoursesStats(course.id, trx)
        : await this.statisticsRepository.updatePaidPurchasedAfterFreemiumCoursesStats(
            course.id,
            trx,
          );
    });

    return true;
  }
}
