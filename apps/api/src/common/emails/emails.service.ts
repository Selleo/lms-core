import { Injectable } from "@nestjs/common";
import { Email } from "./email.interface";
import { EmailAdapter } from "./adapters/email.adapter";

@Injectable()
export class EmailService {
  constructor(private emailAdapter: EmailAdapter) {}

  async sendEmail(email: Email): Promise<void> {
    await this.emailAdapter.sendMail(email);
  }
}
