import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

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
  title: text("title").notNull(),
  ...timestamps,
  archivedAt,
});
