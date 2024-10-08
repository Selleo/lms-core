import { Type } from "@sinclair/typebox";

export const paymentIntentSchema = Type.Object({
  clientSecret: Type.String(),
});
