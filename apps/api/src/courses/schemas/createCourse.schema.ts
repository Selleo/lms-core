import { type Static, Type } from "@sinclair/typebox";

export const baseCourseSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  isPublished: Type.Optional(Type.Boolean()),
  thumbnailS3Key: Type.Optional(Type.String()),
  priceInCents: Type.Optional(Type.Integer()),
  currency: Type.Optional(Type.String()),
  categoryId: Type.String({ format: "uuid" }),
  isScorm: Type.Optional(Type.Boolean()),
});

export const createCourseSchema = Type.Intersect([
  baseCourseSchema,
  Type.Object({
    chapters: Type.Optional(Type.Array(Type.String({ format: "uuid" }))),
  }),
]);

export type CreateCourseBody = Static<typeof createCourseSchema>;
