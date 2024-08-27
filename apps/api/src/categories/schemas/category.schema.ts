import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const allCategoriesSchema = Type.Array(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
    archived: Type.Union([Type.Boolean(), Type.Null()]),
    createdAt: Type.Union([Type.String(), Type.Null()]),
  }),
);

export type AllCategoriesResponse = Static<typeof allCategoriesSchema>;
