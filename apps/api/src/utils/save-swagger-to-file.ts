import { writeFile } from "node:fs";

const SCHEMA_FILE = "./src/swagger/api-schema.json";

export const exportSchemaToFile = (schema: object) => {
  const content = JSON.stringify(schema, null, 2);

  writeFile(SCHEMA_FILE, content, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};
