import { sql } from "drizzle-orm";
import { pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";

export const id = {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
};

export const timestamps = {
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
};

export enum UserRole {
  admin = "admin",
  student = "student",
  tutor = "tutor",
}

const roleEnum = pgEnum("role", [
  UserRole.admin,
  UserRole.student,
  UserRole.tutor,
]);

export const role = {
  role: roleEnum("role").notNull().default(UserRole.student),
};

export const archivedAt = timestamp("archived_at", {
  mode: "string",
  withTimezone: true,
  precision: 3,
});
