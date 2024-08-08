import { Type, Static } from "@sinclair/typebox";
import { commonCategorySchema } from "src/categories/schemas/common-category.schema";

export const allCategoriesSchema = Type.Object({
  categories: Type.Array(Type.Pick(commonCategorySchema, ["id", "title"])),
  totalItems: Type.Number(),
});

export type AllCategoriesResponse = Static<typeof allCategoriesSchema>;
