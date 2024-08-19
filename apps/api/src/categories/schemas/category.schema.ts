import { Type, Static } from "@sinclair/typebox";
import { commonCategorySchema } from "src/categories/schemas/common-category.schema";

export const categorySchema = Type.Pick(commonCategorySchema, ["id", "title"]);

export const allCategoriesSchema = Type.Array(categorySchema);

export type AllCategoriesResponse = Static<typeof allCategoriesSchema>;
export type CategorySchema = Static<typeof categorySchema>;
