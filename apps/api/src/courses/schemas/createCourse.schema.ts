import { type Static, Type } from "@sinclair/typebox";

export const createCourseSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  state: Type.Union([Type.Literal("draft"), Type.Literal("published")]),
  imageUrl: Type.Optional(Type.String()),
  priceInCents: Type.Integer(),
  currency: Type.Optional(Type.String()),
  categoryId: Type.String({ format: "uuid" }),
  lessons: Type.Optional(Type.Array(Type.String({ format: "uuid" }))),
});

export type CreateCourseBody = Static<typeof createCourseSchema>;
