import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { Inject, Injectable } from "@nestjs/common";
import { DatabasePg } from "src/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    @InjectStripeClient() private readonly stripeClient: Stripe,
  ) {}

  async payment(amount: number, currency: string, customerId: string, courseId: string) {
    const { client_secret } = await this.stripeClient.paymentIntents.create({
      amount,
      currency,
      metadata: {
        courseId,
        customerId,
      },
    });

    return client_secret;
  }
}
