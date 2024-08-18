import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { count, eq, ilike, or } from "drizzle-orm";
import { DatabasePg } from "src/common";
import hashPassword from "src/common/helpers/hashPassword";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { credentials, users } from "../storage/schema";

export type UsersQuery = {
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: string;
};

@Injectable()
export class UsersService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createLikeFilter(filter: string) {
    return or(
      ilike(users.email, `%${filter}%`),
      ilike(users.firstName, `%${filter}%`),
      ilike(users.lastName, `%${filter}%`),
    );
  }

  public async getUsers(query: UsersQuery) {
    const { perPage = DEFAULT_PAGE_SIZE, page = 1 } = query;

    return this.db.transaction(async (tx) => {
      const baseQuery = tx.select().from(users);

      const data = await addPagination({
        queryDB: baseQuery,
        page,
        perPage,
      });

      const [totalItems] = await tx.select({ count: count() }).from(users);

      return {
        data,
        pagination: {
          totalItems: Number(totalItems.count),
          page,
          perPage,
          totalPages: Math.ceil(Number(totalItems.count) / perPage),
        },
      };
    });
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
