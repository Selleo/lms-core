import { StripeModule as StripeModuleConfig, StripeWebhookService } from "@golevelup/nestjs-stripe";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { LessonsModule } from "src/lessons/lessons.module";
import { StatisticsModule } from "src/statistics/statistics.module";

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
    LessonsModule,
    StatisticsModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, StripeWebhookHandler, StripeWebhookService],
  exports: [],
})
export class StripeModule {}
