import { Inject, Injectable } from "@nestjs/common";
import { StripeWebhookHandler as StripeWebhookHandlerDecorator } from "@golevelup/nestjs-stripe";
import Stripe from "stripe";
import { and, eq, sql } from "drizzle-orm";
import { DatabasePg } from "src/common";
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
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  @StripeWebhookHandlerDecorator("payment_intent.succeeded")
  async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.customerId;
    const courseId = paymentIntent.metadata.courseId;

    if (!userId && !courseId) return null;

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return null;

    const [course] = await this.db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

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
      const quizLessons = await trx
        .select({
          id: lessons.id,
          itemCount: sql<number>`count(${lessonItems.id})`,
        })
        .from(courseLessons)
        .innerJoin(lessons, eq(courseLessons.lessonId, lessons.id))
        .leftJoin(lessonItems, eq(lessons.id, lessonItems.lessonId))
        .where(
          and(
            eq(courseLessons.courseId, course.id),
            eq(lessons.archived, false),
            eq(lessons.state, "published"),
            eq(lessons.type, "quiz"),
          ),
        )
        .groupBy(lessons.id);

      if (quizLessons.length > 0) {
        await trx.insert(studentLessonsProgress).values(
          quizLessons.map((lesson) => ({
            studentId: userId,
            lessonId: lesson.id,
            quizCompleted: false,
            lessonItemCount: lesson.itemCount,
            completedLessonItemCount: 0,
          })),
        );
      }
    });

    return true;
  }
}
