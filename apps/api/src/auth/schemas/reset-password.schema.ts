import { Static, Type } from "@sinclair/typebox";

export const forgotPasswordSchema = Type.Object({
  email: Type.String({ format: "email", minLength: 1 }),
});

export const resetPasswordSchema = Type.Object({
  newPassword: Type.String({ minLength: 8, maxLength: 64 }),
  resetToken: Type.String({ minLength: 1 }),
});

export type ForgotPasswordBody = Static<typeof forgotPasswordSchema>;
export type ResetPasswordBody = Static<typeof resetPasswordSchema>;
