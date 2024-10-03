import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  stripeSecretKey: Type.String(),
});

type StripeConfigSchema = Static<typeof schema>;

const validateStripeConfig = configValidator(schema);

export default registerAs("stripe", (): StripeConfigSchema => {
  const values = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  };
  return validateStripeConfig(values);
});
