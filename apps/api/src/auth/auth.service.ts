import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { DatabasePg, UUIDType } from "src/common";
import { credentials, resetTokens, users } from "../storage/schema";
import { UsersService } from "../users/users.service";
import hashPassword from "src/common/helpers/hashPassword";
import { EmailService } from "src/common/emails/emails.service";
import { PasswordRecoveryEmail, WelcomeEmail } from "@repo/email-templates";
import { nanoid } from "nanoid";
import { ResetPasswordService } from "./reset-password.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private emailService: EmailService,
    private resetPasswordService: ResetPasswordService,
  ) {}

  public async register({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    return this.db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values({ email, firstName, lastName })
        .returning();

      await trx
        .insert(credentials)
        .values({ userId: newUser.id, password: hashedPassword });

      const emailTemplate = new WelcomeEmail({ email, name: email });

      await this.emailService.sendEmail({
        to: email,
        subject: "Welcome to our platform",
        text: emailTemplate.text,
        html: emailTemplate.html,
        from: "godfather@selleo.com",
      });

      return newUser;
    });
  }

  public async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  public async currentUser(id: UUIDType) {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }

  public async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
        ignoreExpiration: false,
      });

      const user = await this.usersService.getUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const tokens = await this.getTokens(user.id, user.email);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  public async validateUser(email: string, password: string) {
    const [userWithCredentials] = await this.db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        password: credentials.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        role: users.role,
        archived: users.archived,
      })
      .from(users)
      .leftJoin(credentials, eq(users.id, credentials.userId))
      .where(eq(users.email, email));

    if (!userWithCredentials || !userWithCredentials.password) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      userWithCredentials.password,
    );

    if (!isPasswordValid) return null;

    const { password: _, ...user } = userWithCredentials;

    return user;
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.configService.get<string>("jwt.expirationTime"),
          secret: this.configService.get<string>("jwt.secret"),
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: "7d",
          secret: this.configService.get<string>("jwt.refreshSecret"),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  public async forgotPassword(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new BadRequestException("Email not found");

    const resetToken = nanoid(64);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    await this.db.insert(resetTokens).values({
      userId: user.id,
      resetToken,
      expiryDate,
    });

    const emailTemplate = new PasswordRecoveryEmail({
      email,
      name: email,
      resetLink: `${process.env.CORS_ORIGIN}/auth/create-new-password?token=${resetToken}`,
    });

    await this.emailService.sendEmail({
      to: email,
      subject: "Password recovery",
      text: emailTemplate.text,
      html: emailTemplate.html,
      from: "godfather@selleo.com",
    });
  }

  public async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.resetPasswordService.getOneByToken(token);

    await this.usersService.resetPassword(resetToken.userId, newPassword);
    await this.resetPasswordService.deleteToken(token);
  }
}
