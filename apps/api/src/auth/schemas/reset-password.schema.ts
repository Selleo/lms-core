import { Static, Type } from "@sinclair/typebox";

export const forgotPasswordSchema = Type.Object({
  email: Type.String({ format: "email" }),
});

export const resetPasswordSchema = Type.Object({
  newPassword: Type.String({ minLength: 8, maxLength: 64 }),
  resetToken: Type.String(),
});

export type ForgotPasswordBody = Static<typeof forgotPasswordSchema>;
export type ResetPasswordBody = Static<typeof resetPasswordSchema>;
