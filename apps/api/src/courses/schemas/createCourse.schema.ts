import { type Static, Type } from "@sinclair/typebox";

import { STATES } from "src/common/states";

export const baseCourseSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  state: Type.Union([Type.Literal(STATES.draft), Type.Literal(STATES.published)]),
  imageUrl: Type.Optional(Type.String()),
  priceInCents: Type.Integer(),
  currency: Type.Optional(Type.String()),
  categoryId: Type.String({ format: "uuid" }),
});

export const createCourseSchema = Type.Intersect([
  baseCourseSchema,
  Type.Object({
    lessons: Type.Optional(Type.Array(Type.String({ format: "uuid" }))),
  }),
]);

export type CreateCourseBody = Static<typeof createCourseSchema>;
