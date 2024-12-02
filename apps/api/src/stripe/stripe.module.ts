import { StripeModule as StripeModuleConfig, StripeWebhookService } from "@golevelup/nestjs-stripe";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import { StripeController } from "./api/stripe.controller";
import { StripeService } from "./stripe.service";
import { StripeWebhookHandler } from "./stripeWebhook.handler";

@Module({
  imports: [
    StripeModuleConfig.forRootAsync(StripeModuleConfig, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          apiKey: configService.get<string>("stripe.secretKey") || "",
          webhookConfig: {
            stripeSecrets: {
              account: configService.get<string>("stripe.webhookSecret") || "",
            },
            loggingConfiguration: {
              logMatchingEventHandlers: true,
            },
            requestBodyProperty: "rawBody",
          },
        };
      },
    }),
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    StripeWebhookHandler,
    StripeWebhookService,
    LessonsRepository,
    StatisticsRepository,
  ],
  exports: [],
})
export class StripeModule {}
