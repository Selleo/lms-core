import { Type, Static } from "@sinclair/typebox";

import { commonCategorySchema } from "src/categories/schemas/common-category.schema";

export const allCategoriesSchema = Type.Array(commonCategorySchema);

export type AllCategoriesResponse = Static<typeof allCategoriesSchema>;
