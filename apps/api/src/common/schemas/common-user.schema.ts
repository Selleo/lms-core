import { users } from "src/storage/schema";
import { createSelectSchema } from "drizzle-typebox";
import { Static } from "@sinclair/typebox";

export const commonUserSchema = createSelectSchema(users);

export type CommonUser = Static<typeof commonUserSchema>;
