import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { Inject, Injectable } from "@nestjs/common";

import type { DatabasePg } from "src/common";
import Stripe from "stripe";

@Injectable()
export class StripeClientService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    @InjectStripeClient() private readonly stripeClient: Stripe,
  ) {}

  async payment(amount: number, currency: string) {
    const { client_secret } = await this.stripeClient.paymentIntents.create({
      amount,
      currency,
    });

    return client_secret;
  }
}
