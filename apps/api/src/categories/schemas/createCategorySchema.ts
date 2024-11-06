import { type Static, Type } from "@sinclair/typebox";

export const createCategorySchema = Type.Object({
  title: Type.String(),
});

export type CreateCategoryBody = Static<typeof createCategorySchema>;
