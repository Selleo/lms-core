import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { ResendVerificationMailCron } from "src/auth/resend-verification-mail-cron";
import { EmailModule } from "src/common/emails/emails.module";
import { UsersService } from "src/users/users.service";

import { AuthController } from "./api/auth.controller";
import { AuthService } from "./auth.service";
import { CreatePasswordService } from "./create-password.service";
import { ResetPasswordService } from "./reset-password.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
import { TokenService } from "./token.service";

@Module({
  imports: [PassportModule, EmailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    JwtStrategy,
    LocalStrategy,
    CreatePasswordService,
    ResetPasswordService,
    ResendVerificationMailCron,
  ],
  exports: [],
})
export class AuthModule {}
