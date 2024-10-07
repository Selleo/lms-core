import { Inject, Injectable } from "@nestjs/common";
import { StripeWebhookHandler as StripeWebhookHandlerDecorator } from "@golevelup/nestjs-stripe";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { courses, studentCourses, users } from "src/storage/schema";

@Injectable()
export class StripeWebhookHandler {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  @StripeWebhookHandlerDecorator("payment_intent.succeeded")
  async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("PaymentIntent was successful!");
    console.log("PaymentIntent ID:", paymentIntent.id);
    console.log("Amount:", paymentIntent.amount);
    console.log("Currency:", paymentIntent.currency);
    console.log("Customer ID:", paymentIntent.customer);
    console.log("Metadata:", paymentIntent.metadata);

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

    return true;
  }
}
