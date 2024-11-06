import { Type, type Static } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const categorySchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  archived: Type.Union([Type.Boolean(), Type.Null()]),
  createdAt: Type.Union([Type.String(), Type.Null()]),
});

export type CategorySchema = Static<typeof categorySchema>;
export type AllCategoriesResponse = Static<typeof categorySchema>[];
