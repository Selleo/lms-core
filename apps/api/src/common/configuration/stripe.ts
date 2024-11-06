import { registerAs } from "@nestjs/config";
import { type Static, Type } from "@sinclair/typebox";

import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  secretKey: Type.String(),
  webhookSecret: Type.String(),
});

type StripeConfigSchema = Static<typeof schema>;

const validateStripeConfig = configValidator(schema);

export default registerAs("stripe", (): StripeConfigSchema => {
  const values = {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  };
  return validateStripeConfig(values);
});
