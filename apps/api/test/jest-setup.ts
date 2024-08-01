import { applyFormats } from "nestjs-typebox";
import { setupValidation } from "../src/utils/setup-validation";

beforeAll(async () => {
  applyFormats();
  setupValidation();
});
