import { Static, Type } from "@sinclair/typebox";

export const changePasswordSchema = Type.Object({
  newPassword: Type.String({ minLength: 8, maxLength: 64 }),
  oldPassword: Type.String({ minLength: 8, maxLength: 64 }),
});

export type ChangePasswordBody = Static<typeof changePasswordSchema>;
