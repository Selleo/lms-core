import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "uploads");

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export const providerConfig =
  process.env.NODE_ENV === "production"
    ? {
        aws: {
          bucket: process.env.AWS_BUCKET_NAME || "default-bucket",
          region: process.env.AWS_REGION || "us-east-1",
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "default-access-key",
          secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY || "default-secret-key",
        },
      }
    : {
        local: {
          bucket: path.join(dirPath, "..", "uploads"),
          opts: {},
        },
      };
