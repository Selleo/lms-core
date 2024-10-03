import { Module } from "@nestjs/common";
import { StripeClientController } from "./api/stripeClient.controller";
import { StripeClientService } from "./stripeClient.service";

import { ConfigService } from "@nestjs/config";
import { StripeModule } from "@golevelup/nestjs-stripe";

@Module({
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          apiKey: configService.get<string>("stripe.stripeSecretKey") || "",
        };
      },
    }),
  ],
  controllers: [StripeClientController],
  providers: [StripeClientService],
  exports: [],
})
export class StripeClientModule {}
