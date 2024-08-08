import { Injectable } from "@nestjs/common";
import { EmailAdapter } from "../../src/common/emails/adapters/email.adapter";
import { Email } from "../../src/common/emails/email.interface";
import { last } from "lodash";

@Injectable()
export class EmailTestingAdapter extends EmailAdapter {
  private sentEmails: Email[] = [];

  async sendMail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  getAllEmails(): Email[] {
    return this.sentEmails;
  }

  getLastEmail(): Email | undefined {
    return last(this.sentEmails);
  }

  clearEmails(): void {
    this.sentEmails = [];
  }
}
