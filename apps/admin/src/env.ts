import "dotenv/config";
import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const client = Type.Object({
  DATABASE_URL: Type.String(),
  SESSION_SECRET: Type.String(),
});

type EnvOutput = Static<typeof client>;

const metaEnv: Record<keyof EnvOutput, string | undefined> = {
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

const compiled = TypeCompiler.Compile(client);

if (!compiled.Check(metaEnv)) {
  const errors = [...compiled.Errors(metaEnv)];
  console.error("❗Invalid environment variables:", errors);
  throw new Error("Invalid environment variables");
}

const env: EnvOutput = metaEnv;
export { env };
