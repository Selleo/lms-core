import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import hashPassword from "src/common/helpers/hashPassword";
import { credentials, users } from "../storage/schema";
import { UserRole } from "./schemas/user-roles";

@Injectable()
export class UsersService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private configService: ConfigService,
  ) {}

  public async createUser({
    email,
    firstName,
    lastName,
    role,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const passwordToken = crypto.randomUUID();

    /**
     * TODO: Add expiration of set password link
     * https://selleolabs.atlassian.net/browse/LC-136
     */

    return this.db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values({ email, firstName, lastName, role })
        .returning();

      await trx
        .insert(credentials)
        .values({ userId: newUser.id, password: passwordToken });

      const setPasswordLink = `${this.configService.get<string>("app.APP_URL")}/set-password?token=${passwordToken}`;

      console.info(setPasswordLink);

      /**
       *
       * TODO: Send email with set password link
       * https://selleolabs.atlassian.net/browse/LC-92
       *
       */

      return newUser;
    });
  }

  public async setPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const [userCredentials] = await this.db
      .select({
        credentialId: credentials.id,
      })
      .from(credentials)
      .where(eq(credentials.password, token));

    if (!userCredentials) {
      throw new NotFoundException("Invalid token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.db
      .update(credentials)
      .set({ password: hashedPassword })
      .where(eq(credentials.id, userCredentials.credentialId));
  }

  public async getUsers() {
    const allUsers = await this.db.select().from(users);

    return allUsers;
  }

  public async getUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async updateUser(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [updatedUser] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [userCredentials] = await this.db
      .select()
      .from(credentials)
      .where(eq(credentials.userId, id));

    if (!userCredentials) {
      throw new NotFoundException("User credentials not found");
    }

    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      userCredentials.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException("Invalid old password");
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await this.db
      .update(credentials)
      .set({ password: hashedNewPassword })
      .where(eq(credentials.userId, id));
  }

  public async deleteUser(id: string) {
    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
  }
}
