import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

import { EmailAdapter } from "./email.adapter";

import type { Email } from "../email.interface";

@Injectable()
export class LocalAdapter extends EmailAdapter {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();

    let host = this.configService.get<string>("email.SMTP_HOST");
    let port = this.configService.get<number>("email.SMTP_PORT");

    if (!host) {
      host = "localhost";
    }
    if (!port) {
      port = 1025;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: undefined,
    });
  }

  async sendMail(email: Email): Promise<void> {
    await this.transporter.sendMail(email);
  }
}
