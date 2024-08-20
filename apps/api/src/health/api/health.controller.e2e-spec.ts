import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createE2ETest } from "../../../test/create-e2e-test";

describe("HealthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { app: testApp } = await createE2ETest();
    app = testApp;
  });

  describe("GET /healthcheck", () => {
    it("should return 200 for healthy server", async () => {
      const response = await request(app.getHttpServer()).get("/healthcheck");

      expect(response.status).toBe(200);
    });
  });
});
