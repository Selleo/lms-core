import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

export function getGlobalCSS() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return readFileSync(path.join(__dirname, "global.css"), "utf8");
}

export * from "./components/index.js";
