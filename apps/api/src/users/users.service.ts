import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq, inArray } from "drizzle-orm";
import { DatabasePg } from "src/common";
import hashPassword from "src/common/helpers/hashPassword";
import { credentials, users } from "../storage/schema";
import { UserRole } from "./schemas/user-roles";

@Injectable()
export class UsersService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

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

  public async getUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      archived?: boolean;
      role?: UserRole;
    },
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

  async resetPassword(id: string, newPassword: string) {
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

  public async deleteBulkUsers(ids: string[]) {
    const deletedUsers = await this.db
      .delete(users)
      .where(inArray(users.id, ids))
      .returning();

    if (deletedUsers.length !== ids.length) {
      throw new NotFoundException("Users not found");
    }
  }
}
