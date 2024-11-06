import { registerAs } from "@nestjs/config";
import { type Static, Type } from "@sinclair/typebox";

import { configValidator } from "src/utils/configValidator";

const schema = Type.Object({
  AWS_REGION: Type.String(),
  AWS_ACCESS_KEY_ID: Type.String(),
  AWS_SECRET_ACCESS_KEY: Type.String(),
  AWS_S3_BUCKET_NAME: Type.String(),
});

type S3ConfigSchema = Static<typeof schema>;

const validateS3Config = configValidator(schema);

export default registerAs("s3", (): S3ConfigSchema => {
  const values = {
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_S3_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  };
  return validateS3Config(values);
});
