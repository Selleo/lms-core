import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { archivedAt, id, timestamps } from "./utils";
import { userRoles, UserRoles } from "src/users/schemas/user-roles";

const roleEnum = pgEnum("role", userRoles);

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: roleEnum("role").notNull().default(UserRoles.student),
  archived: boolean("archived").notNull().default(false),
});

export const credentials = pgTable("credentials", {
  ...id,
  ...timestamps,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  ...id,
  title: text("title").notNull().unique(),
  ...timestamps,
  archivedAt,
});

export const resetTokens = pgTable("reset_tokens", {
  ...id,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resetToken: text("reset_token").notNull(),
  expiryDate: timestamp("expiry_date", {
    precision: 3,
    withTimezone: true,
  }).notNull(),
  ...timestamps,
});
