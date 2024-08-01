import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  secret: Type.String(),
  refreshSecret: Type.String(),
  expirationTime: Type.String(),
});

type JWTConfig = Static<typeof schema>;

export default registerAs("jwt", (): JWTConfig => {
  const values = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expirationTime: process.env.JWT_EXPIRATION_TIME,
  };

  return Value.Decode(schema, values);
});
