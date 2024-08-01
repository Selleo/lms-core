import { FormatRegistry } from "@sinclair/typebox";
import { validate as uuidValidate } from "uuid";

export function setupValidation() {
  FormatRegistry.Set("uuid", (value) => uuidValidate(value));
}
