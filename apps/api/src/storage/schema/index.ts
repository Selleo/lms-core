import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { archivedAt, id, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
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
  title: varchar("title", { length: 100 }).notNull(),
  ...timestamps,
  archivedAt,
});
