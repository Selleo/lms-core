import fs from "fs";
import path from "path";

export const tailwindStyles = fs.readFileSync(
  path.join(__dirname, "../dist/styles.css"),
  "utf8"
);
