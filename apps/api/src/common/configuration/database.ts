import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  url: Type.String(),
});

type DatabaseConfig = Static<typeof schema>;

const validateDatabaseConfig = configValidator(schema);

export default registerAs("database", (): DatabaseConfig => {
  const values = {
    url: process.env.DATABASE_URL,
  };

  return validateDatabaseConfig(values);
});
