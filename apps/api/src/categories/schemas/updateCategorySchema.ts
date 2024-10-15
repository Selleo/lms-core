import { Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const updateCategorySchema = Type.Partial(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
  }),
);

export type UpdateCategoryBody = Static<typeof updateCategorySchema>;
