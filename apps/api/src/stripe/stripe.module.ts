import { StripeModule as StripeModuleConfig, StripeWebhookService } from "@golevelup/nestjs-stripe";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { StatisticsModule } from "src/statistics/statistics.module";

import { StripeController } from "./api/stripe.controller";
import { StripeService } from "./stripe.service";
import { StripeWebhookHandler } from "./stripeWebhook.handler";
import { LessonModule } from "src/lesson/lesson.module";

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
    LessonModule,
    StatisticsModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, StripeWebhookHandler, StripeWebhookService],
  exports: [],
})
export class StripeModule {}
