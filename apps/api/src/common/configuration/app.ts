import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  APP_URL: Type.String({ format: "uri" }),
});

type AppConfigSchema = Static<typeof schema>;

const validateAppConfig = configValidator(schema);

export default registerAs("app", (): AppConfigSchema => {
  const values = {
    APP_URL: process.env.APP_URL,
  };

  return validateAppConfig(values);
});
