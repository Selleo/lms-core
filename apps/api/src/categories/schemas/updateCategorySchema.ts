import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const updateCategorySchema = Type.Partial(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
    archived: Type.Boolean(),
  }),
);

export type UpdateCategoryBody = Static<typeof updateCategorySchema>;
