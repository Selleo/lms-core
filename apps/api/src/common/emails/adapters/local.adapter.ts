import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { Email } from "../email.interface";
import { EmailAdapter } from "./email.adapter";

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
      ignoreTLS: true,
    });
  }

  async sendMail(email: Email): Promise<void> {
    await this.transporter.sendMail(email);
  }
}
