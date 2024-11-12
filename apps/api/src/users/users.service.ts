import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreatePasswordEmail } from "@repo/email-templates";
import * as bcrypt from "bcrypt";
import { and, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { DatabasePg } from "src/common";
import { EmailService } from "src/common/emails/emails.service";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import hashPassword from "src/common/helpers/hashPassword";
import { DEFAULT_PAGE_SIZE } from "src/common/pagination";

import { createTokens, credentials, userDetails, users } from "../storage/schema";

import {
  type SortUserFieldsOptions,
  type UsersFilterSchema,
  type UserSortField,
  UserSortFields,
} from "./schemas/userQuery";

import type { UpsertUserDetailsBody } from "./schemas/update-user.schema";
import type { UserRole } from "./schemas/user-roles";
import type { UserDetails } from "./schemas/user.schema";
import type { CreateUserBody } from "src/users/schemas/create-user.schema";

type UsersQuery = {
  filters?: UsersFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortUserFieldsOptions;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private emailService: EmailService,
  ) {}

  public async getUsers(query: UsersQuery = {}) {
    const {
      sort = UserSortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const conditions = this.getFiltersConditions(filters);

    const usersData = await this.db
      .select()
      .from(users)
      .where(and(...conditions))
      .orderBy(sortOrder(this.getColumnToSortBy(sortedField as UserSortField)));

    const [{ totalItems }] = await this.db
      .select({ totalItems: count() })
      .from(users)
      .where(and(...conditions));

    return {
      data: usersData,
      pagination: {
        totalItems,
        page,
        perPage,
      },
    };
  }

  public async getUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async getUserDetails(userId: string): Promise<UserDetails> {
    const [userBio]: UserDetails[] = await this.db
      .select({
        id: userDetails.id,
        description: userDetails.description,
        contactEmail: userDetails.contactEmail,
        contactPhone: userDetails.contactPhoneNumber,
        jobTitle: userDetails.jobTitle,
      })
      .from(userDetails)
      .where(eq(userDetails.userId, userId));

    if (!userBio) {
      throw new NotFoundException("User details not found");
    }

    return userBio;
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
    const [existingUser] = await this.db.select().from(users).where(eq(users.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [updatedUser] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();

    return updatedUser;
  }

  async upsertUserDetails(userId: string, data: UpsertUserDetailsBody) {
    const [existingUser] = await this.db.select().from(users).where(eq(users.id, userId));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [updatedUserDetails] = await this.db
      .update(userDetails)
      .set(data)
      .where(eq(userDetails.userId, userId))
      .returning();

    return updatedUserDetails;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const [existingUser] = await this.db.select().from(users).where(eq(users.id, id));

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

    const isOldPasswordValid = await bcrypt.compare(oldPassword, userCredentials.password);
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
    const [existingUser] = await this.db.select().from(users).where(eq(users.id, id));

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
    const [deletedUser] = await this.db.delete(users).where(eq(users.id, id)).returning();

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
  }

  public async deleteBulkUsers(ids: string[]) {
    const deletedUsers = await this.db.delete(users).where(inArray(users.id, ids)).returning();

    if (deletedUsers.length !== ids.length) {
      throw new NotFoundException("Users not found");
    }
  }

  public async createUser(data: CreateUserBody) {
    const [existingUser] = await this.db.select().from(users).where(eq(users.email, data.email));

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    return await this.db.transaction(async (trx) => {
      const [createdUser] = await trx.insert(users).values(data).returning();

      const token = nanoid(64);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      await trx.insert(createTokens).values({
        userId: createdUser.id,
        createToken: token,
        expiryDate,
      });

      const url = `${process.env.CORS_ORIGIN}/auth/create-new-password?createToken=${token}&email=${createdUser.email}`;

      const { text, html } = new CreatePasswordEmail({
        name: createdUser.firstName,
        role: createdUser.role,
        createPasswordLink: url,
      });

      await this.emailService.sendEmail({
        to: createdUser.email,
        subject: "Welcome to the Platform!",
        text,
        html,
        from: process.env.SES_EMAIL || "",
      });

      return createdUser;
    });
  }

  private getFiltersConditions(filters: UsersFilterSchema) {
    const conditions = [];

    if (filters.keyword) {
      conditions.push(
        or(
          ilike(users.firstName, `%${filters.keyword.toLowerCase()}%`),
          ilike(users.lastName, `%${filters.keyword.toLowerCase()}%`),
          ilike(users.email, `%${filters.keyword.toLowerCase()}%`),
        ),
      );
    }
    if (filters.archived !== undefined) {
      conditions.push(eq(users.archived, filters.archived));
    }
    if (filters.role) {
      conditions.push(eq(users.role, filters.role));
    }

    return conditions.length ? conditions : [sql`1=1`];
  }

  private getColumnToSortBy(sort: UserSortField) {
    switch (sort) {
      case UserSortFields.createdAt:
        return users.createdAt;
      case UserSortFields.role:
        return users.role;
      default:
        return users.firstName;
    }
  }
}
