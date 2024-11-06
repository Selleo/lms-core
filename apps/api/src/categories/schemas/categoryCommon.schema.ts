import { createSelectSchema } from "drizzle-typebox";

import { categories } from "src/storage/schema";

import type { Static } from "@sinclair/typebox";

export const commonCategorySchema = createSelectSchema(categories);

export type CommonCategory = Static<typeof commonCategorySchema>;
