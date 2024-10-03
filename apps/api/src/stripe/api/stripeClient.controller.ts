import { Controller, Post, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import { Type } from "@sinclair/typebox";
import { paymentIntentSchema } from "../schemas/payment";
import { BaseResponse, baseResponse } from "src/common";
import { StripeClientService } from "../stripeClient.service";

@Controller("stripe_client_controller")
export class StripeClientController {
  constructor(private readonly stripeClientService: StripeClientService) {}

  @Post()
  @Validate({
    response: baseResponse(paymentIntentSchema),
    request: [
      {
        type: "query",
        name: "amount",
        schema: Type.Number(),
      },
      {
        type: "query",
        name: "currency",
        schema: Type.String(),
      },
    ],
  })
  async createPaymentIntent(
    @Query("amount") amount: number,
    @Query("currency") currency: string,
  ) {
    return new BaseResponse({
      clientSecret: await this.stripeClientService.payment(amount, currency),
    });
  }
}
