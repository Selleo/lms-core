import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Email } from "../email.interface";
import { EmailAdapter } from "./email.adapter";

@Injectable()
export class LocalAdapter extends EmailAdapter {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true,
    });
  }

  async sendMail(email: Email): Promise<void> {
    await this.transporter.sendMail(email);
  }
}
