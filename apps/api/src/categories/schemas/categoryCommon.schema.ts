import { type Static } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { categories } from "src/storage/schema";

export const commonCategorySchema = createSelectSchema(categories);

export type CommonCategory = Static<typeof commonCategorySchema>;
