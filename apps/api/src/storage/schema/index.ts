import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { archivedAt, id, role, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
  ...role,
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
