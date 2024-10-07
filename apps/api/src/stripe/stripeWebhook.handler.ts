import { Injectable } from "@nestjs/common";
import { StripeWebhookHandler as StripeWebhookHandlerDecorator } from "@golevelup/nestjs-stripe";
import Stripe from "stripe";

@Injectable()
export class StripeWebhookHandler {
  @StripeWebhookHandlerDecorator("payment_intent.succeeded")
  async handlePaymentIntentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("PaymentIntent was successful!");
    console.log("PaymentIntent ID:", paymentIntent.id);
    console.log("Amount:", paymentIntent.amount);
    console.log("Currency:", paymentIntent.currency);
    console.log("Customer ID:", paymentIntent.customer);
    console.log("Customer ID:", paymentIntent);

    // Add your business logic here
  }
}
