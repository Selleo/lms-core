import { sql } from "drizzle-orm";
import { boolean, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const archived = boolean("archived").default(false).notNull();

export const STATUS = {
  draft: { key: "draft", value: "Draft" },
  published: { key: "published", value: "Published" },
} as const;

export const STATUS_KEYS = Object.fromEntries(
  Object.entries(STATUS).map(([key, { value }]) => [key, value]),
);
