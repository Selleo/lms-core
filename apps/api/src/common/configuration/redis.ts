import { registerAs } from "@nestjs/config";
import { type Static, Type } from "@sinclair/typebox";

import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  REDIS_URL: Type.String(),
});

type RedisConfigSchema = Static<typeof schema>;

const validateRedisConfig = configValidator(schema);

export default registerAs("redis", (): RedisConfigSchema => {
  const values = {
    REDIS_URL: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  };

  return validateRedisConfig(values);
});
