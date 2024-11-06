import { createSelectSchema } from "drizzle-typebox";

import { users } from "src/storage/schema";

import type { Static } from "@sinclair/typebox";

export const commonUserSchema = createSelectSchema(users);

export type CommonUser = Static<typeof commonUserSchema>;
