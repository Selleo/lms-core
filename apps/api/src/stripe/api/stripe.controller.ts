import {
  InjectStripeClient,
  InjectStripeModuleConfig,
  StripeModuleConfig,
} from "@golevelup/nestjs-stripe";
import { Controller, Post, Query, Headers, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import Stripe from "stripe";

import { BaseResponse, baseResponse } from "src/common";
import { Public } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { USER_ROLES } from "src/user/schemas/userRoles";

import { paymentIntentSchema } from "../schemas/payment";
import { StripeService } from "../stripe.service";
import { StripeWebhookHandler } from "../stripeWebhook.handler";

interface RequestWithRawBody extends Request {
  rawBody?: string;
}

@Controller("stripe")
export class StripeController {
  private readonly requestBodyProperty: string;

  constructor(
    @InjectStripeModuleConfig()
    config: StripeModuleConfig,
    @InjectStripeClient() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly stripeWebhookHandler: StripeWebhookHandler,
  ) {
    this.requestBodyProperty = config.webhookConfig?.requestBodyProperty || "body";
  }

  @Post()
  @Roles(USER_ROLES.STUDENT)
  @Validate({
    response: baseResponse(paymentIntentSchema),
    request: [
      {
        type: "query",
        name: "amount",
        schema: Type.Number(),
        required: true,
      },
      {
        type: "query",
        name: "currency",
        schema: Type.String(),
        required: true,
      },
      {
        type: "query",
        name: "customerId",
        schema: Type.String(),
        required: true,
      },
      {
        type: "query",
        name: "courseId",
        schema: Type.String(),
        required: true,
      },
    ],
  })
  async createPaymentIntent(
    @Query("amount") amount: number,
    @Query("currency") currency: string,
    @Query("customerId") customerId: string,
    @Query("courseId") courseId: string,
  ) {
    return new BaseResponse({
      clientSecret: await this.stripeService.payment(amount, currency, customerId, courseId),
    });
  }

  @Public()
  @Post("webhook")
  async handleWebhook(
    @Headers("stripe-signature") sig: string,
    @Req() request: RequestWithRawBody,
  ) {
    try {
      if (!sig) {
        throw new Error("Missing stripe-signature header");
      }
      const rawBody = request.rawBody;
      if (!rawBody) {
        throw new Error("Missing raw body");
      }
      const rawBodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);

      const event = this.stripeClient.webhooks.constructEvent(
        rawBodyBuffer,
        sig,
        this.configService.get<string>("stripe.webhookSecret") || "",
      );

      if (event.type === "payment_intent.succeeded") {
        await this.stripeWebhookHandler.handlePaymentIntentSucceeded(event);
      } else {
        console.log(`Unhandled event type: ${event.type}`);
      }

      return new BaseResponse({
        clientSecret: 22,
      });
    } catch (err) {
      console.error("Error processing webhook:", err);
      return new BaseResponse({
        clientSecret: 22,
      });
    }
  }
}
