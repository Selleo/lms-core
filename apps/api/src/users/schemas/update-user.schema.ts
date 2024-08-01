import { Static, Type } from "@sinclair/typebox";

export const updateUserSchema = Type.Object({
  email: Type.Optional(Type.String({ format: "email" })),
});

export type UpdateUserBody = Static<typeof updateUserSchema>;
