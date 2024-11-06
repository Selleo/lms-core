import { applyFormats } from "nestjs-typebox";

import { closeTestDatabase } from "./test-database";
import { setupValidation } from "../src/utils/setup-validation";

beforeAll(async () => {
  applyFormats();
  setupValidation();
});

afterAll(async () => {
  await closeTestDatabase();
});
