import { categories } from "src/storage/schema";
import { createSelectSchema } from "drizzle-typebox";
import { Static } from "@sinclair/typebox";

export const commonCategorySchema = createSelectSchema(categories);

export type CommonCategory = Static<typeof commonCategorySchema>;
