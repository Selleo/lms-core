import { type Static } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

export const commonUserSchema = createSelectSchema(users);

export type CommonUser = Static<typeof commonUserSchema>;
