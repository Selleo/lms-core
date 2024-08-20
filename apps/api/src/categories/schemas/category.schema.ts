import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const allCategoriesSchema = Type.Array(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
    archivedAt: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.Union([Type.String(), Type.Null()]),
  }),
);

export type AllCategoriesResponse = Static<typeof allCategoriesSchema>;
