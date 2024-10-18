import { Static, Type } from "@sinclair/typebox";

export const updateUserSchema = Type.Object({
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: "email" })),
  role: Type.Optional(
    Type.Union([
      Type.Literal("admin"),
      Type.Literal("student"),
      Type.Literal("tutor"),
    ]),
  ),
  archived: Type.Optional(Type.Boolean()),
});

export type UpdateUserBody = Static<typeof updateUserSchema>;
