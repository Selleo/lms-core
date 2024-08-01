import { Static, Type } from "@sinclair/typebox";

export const createAccountSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export type CreateAccountBody = Static<typeof createAccountSchema>;
