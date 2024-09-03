import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class ResendVerificationMailCron {
  constructor(private authService: AuthService) {}

  @Cron("0 9 * * *")
  async resendVerificationMail() {
    await this.authService.checkTokenExpiryAndSendEmail();
  }
}
