import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

import type { UUIDType } from "src/common";

@Injectable()
export class StripeService {
  constructor(@InjectStripeClient() private readonly stripeClient: Stripe) {}

  async payment(amount: number, currency: string, customerId: UUIDType, courseId: UUIDType) {
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
