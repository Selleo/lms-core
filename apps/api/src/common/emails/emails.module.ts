import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailAdapter } from "./adapters/email.adapter";
import { EmailService } from "./emails.service";
import { EmailAdapterFactory } from "./factory/email-adapters.factory";

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailAdapterFactory,
    {
      provide: EmailAdapter,
      useFactory: (factory: EmailAdapterFactory) => factory.createAdapter(),
      inject: [EmailAdapterFactory],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
