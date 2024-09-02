import { type Static, Type } from "@sinclair/typebox";

export const createPasswordSchema = Type.Object({
  password: Type.String({ minLength: 8, maxLength: 64 }),
  createToken: Type.String({ minLength: 1 }),
});

export type CreatePasswordBody = Static<typeof createPasswordSchema>;
