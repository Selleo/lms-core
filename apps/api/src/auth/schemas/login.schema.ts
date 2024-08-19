import { type Static, Type } from "@sinclair/typebox";

export const loginSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  rememberMe: Type.Optional(Type.Boolean()),
});

export type LoginBody = Static<typeof loginSchema>;
