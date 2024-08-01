import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  url: Type.String(),
});

type DatabaseConfig = Static<typeof schema>;

export default registerAs("database", (): DatabaseConfig => {
  const values = {
    url: process.env.DATABASE_URL,
  };

  return Value.Decode(schema, values);
});
