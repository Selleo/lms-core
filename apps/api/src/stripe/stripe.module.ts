import { StripeModule as StripeModuleConfig, StripeWebhookService } from "@golevelup/nestjs-stripe";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CourseModule } from "src/courses/course.module";

import { StripeController } from "./stripe.controller";
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
    CourseModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, StripeWebhookHandler, StripeWebhookService],
  exports: [],
})
export class StripeModule {}
