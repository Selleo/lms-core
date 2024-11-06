import { type Static, Type } from "@sinclair/typebox";

export const createUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String({ minLength: 1, maxLength: 64 }),
  lastName: Type.String({ minLength: 1, maxLength: 64 }),
  role: Type.Union([Type.Literal("admin"), Type.Literal("student"), Type.Literal("tutor")]),
});

export type CreateUserBody = Static<typeof createUserSchema>;
