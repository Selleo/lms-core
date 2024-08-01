import { applyFormats } from "nestjs-typebox";
import { setupValidation } from "../src/utils/setup-validation";
import { closeTestDatabase } from "./test-database";

beforeAll(async () => {
  applyFormats();
  setupValidation();
});

afterAll(async () => {
  await closeTestDatabase();
});
