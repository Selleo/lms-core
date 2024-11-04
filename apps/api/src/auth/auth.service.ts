import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { DatabasePg, UUIDType } from "src/common";
import {
  createTokens,
  credentials,
  resetTokens,
  users,
} from "../storage/schema";
import { UsersService } from "../users/users.service";
import hashPassword from "src/common/helpers/hashPassword";
import { EmailService } from "src/common/emails/emails.service";
import {
  CreatePasswordReminderEmail,
  PasswordRecoveryEmail,
  WelcomeEmail,
} from "@repo/email-templates";
import { nanoid } from "nanoid";
import { ResetPasswordService } from "./reset-password.service";
import { CreatePasswordService } from "./create-password.service";
import { CORS_ORIGIN } from "src/auth/consts";
import { CommonUser } from "src/common/schemas/common-user.schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private emailService: EmailService,
    private createPasswordService: CreatePasswordService,
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
        from: process.env.SES_EMAIL || "",
      });

      return newUser;
    });
  }

  public async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.getTokens(user);

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

      const tokens = await this.getTokens(user);
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

  private async getTokens(user: CommonUser) {
    const { id: userId, email, role } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email, role },
        {
          expiresIn: this.configService.get<string>("jwt.expirationTime"),
          secret: this.configService.get<string>("jwt.secret"),
        },
      ),
      this.jwtService.signAsync(
        { userId, email, role },
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
      resetLink: `${CORS_ORIGIN}/auth/create-new-password?resetToken=${resetToken}&email=${email}`,
    });

    await this.emailService.sendEmail({
      to: email,
      subject: "Password recovery",
      text: emailTemplate.text,
      html: emailTemplate.html,
      from: "godfather@selleo.com",
    });
  }

  public async createPassword(token: string, password: string) {
    const createToken = await this.createPasswordService.getOneByToken(token);

    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, createToken.userId));

    if (!existingUser) throw new NotFoundException("User not found");

    const hashedPassword = await hashPassword(password);

    await this.db
      .insert(credentials)
      .values({ userId: createToken.userId, password: hashedPassword });
    await this.createPasswordService.deleteToken(token);
  }

  public async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.resetPasswordService.getOneByToken(token);

    await this.usersService.resetPassword(resetToken.userId, newPassword);
    await this.resetPasswordService.deleteToken(token);
  }

  private async fetchExpiredTokens() {
    return this.db
      .select({
        userId: createTokens.userId,
        email: users.email,
        oldCreateToken: createTokens.createToken,
        tokenExpiryDate: createTokens.expiryDate,
      })
      .from(createTokens)
      .leftJoin(credentials, eq(createTokens.userId, credentials.userId))
      .innerJoin(users, eq(createTokens.userId, users.id))
      .where(
        and(
          isNull(credentials.userId),
          lte(sql`DATE(${createTokens.expiryDate})`, sql`CURRENT_DATE`),
        ),
      );
  }

  private generateNewTokenAndEmail(email: string) {
    const createToken = nanoid(64);
    const emailTemplate = new CreatePasswordReminderEmail({
      createPasswordLink: `${CORS_ORIGIN}/auth/create-new-password?createToken=${createToken}&email=${email}`,
    });

    return { createToken, emailTemplate };
  }

  private async sendEmailAndUpdateDatabase(
    userId: string,
    email: string,
    oldCreateToken: string,
    createToken: string,
    emailTemplate: { text: string; html: string },
    expiryDate: Date,
  ) {
    await this.db.transaction(async (transaction) => {
      try {
        await transaction.insert(createTokens).values({
          userId,
          createToken,
          expiryDate,
        });

        await this.emailService.sendEmail({
          to: email,
          subject: "Account creation reminder",
          text: emailTemplate.text,
          html: emailTemplate.html,
          from: "godfather@selleo.com",
        });

        await transaction
          .delete(createTokens)
          .where(eq(createTokens.createToken, oldCreateToken));
      } catch (error) {
        transaction.rollback();

        throw error;
      }
    });
  }

  public async checkTokenExpiryAndSendEmail() {
    const expiryTokens = await this.fetchExpiredTokens();

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    expiryTokens.map(async ({ userId, email, oldCreateToken }) => {
      const { createToken, emailTemplate } =
        this.generateNewTokenAndEmail(email);

      await this.sendEmailAndUpdateDatabase(
        userId,
        email,
        oldCreateToken,
        createToken,
        emailTemplate,
        expiryDate,
      );
    });
  }
}
