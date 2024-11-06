import { Injectable } from "@nestjs/common";

import { EmailAdapter } from "./adapters/email.adapter";
import { type Email } from "./email.interface";

@Injectable()
export class EmailService {
  constructor(private emailAdapter: EmailAdapter) {}

  async sendEmail(email: Email): Promise<void> {
    await this.emailAdapter.sendMail(email);
  }
}
