import { Static, Type } from "@sinclair/typebox";

export const updateCourseSchema = Type.Partial(
  Type.Object({
    title: Type.String(),
    description: Type.String(),
    state: Type.Union([Type.Literal("draft"), Type.Literal("published")]),
    priceInCents: Type.Integer(),
    currency: Type.String(),
    categoryId: Type.String({ format: "uuid" }),
    lessons: Type.Array(Type.String({ format: "uuid" })),
    archived: Type.Optional(Type.Boolean()),
  }),
);

export type UpdateCourseBody = Static<typeof updateCourseSchema>;
