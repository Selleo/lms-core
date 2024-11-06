import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { type EmailConfigSchema } from "src/common/configuration/email";
import { match, P } from "ts-pattern";

import { type EmailAdapter } from "../adapters/email.adapter";
import { LocalAdapter } from "../adapters/local.adapter";
import { AWSSESAdapter } from "../adapters/ses.adapter";
import { SmtpAdapter } from "../adapters/smtp.adapter";

type AdapterType = EmailConfigSchema["EMAIL_ADAPTER"];

@Injectable()
export class EmailAdapterFactory {
  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
  ) {}

  async createAdapter(): Promise<EmailAdapter> {
    const adapterType = this.configService.get<AdapterType>("EMAIL_ADAPTER");
    const adapter = match(adapterType)
      .with("mailhog", () => LocalAdapter)
      .with("smtp", () => SmtpAdapter)
      .with("ses", () => AWSSESAdapter)
      .with(P.nullish, () => {
        throw new Error("EMAIL_ADAPTER is not defined in configuration");
      })
      .otherwise((type) => {
        throw new Error(`Unknown email adapter type: ${type}`);
      });

    return await this.moduleRef.create<EmailAdapter>(adapter);
  }
}
