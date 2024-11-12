import { castArray, omit } from "lodash";
import request from "supertest";

import { AuthService } from "../../../src/auth/auth.service";
import { createE2ETest } from "../../../test/create-e2e-test";
import { createUserFactory, type UserWithCredentials } from "../../../test/factory/user.factory";

import type { DatabasePg } from "../../../src/common";
import type { INestApplication } from "@nestjs/common";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;
  let testUser: UserWithCredentials;
  let cookies: string;
  const testPassword = "password123";
  let db: DatabasePg;
  let userFactory: ReturnType<typeof createUserFactory>;

  beforeAll(async () => {
    const { app: testApp } = await createE2ETest();
    app = testApp;
    authService = app.get(AuthService);
    db = app.get("DB");
    userFactory = createUserFactory(db);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    testUser = await userFactory.withCredentials({ password: testPassword }).create();

    const loginResponse = await request(app.getHttpServer()).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.credentials?.password,
    });

    cookies = loginResponse.headers["set-cookie"];
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/users")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data).toStrictEqual(castArray(omit(testUser, "credentials")));
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /users/user?id=:id", () => {
    it("should return a user by id", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/user?id=${testUser.id}`)
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data).toStrictEqual(omit(testUser, "credentials"));
    });

    it("should return 404 for non-existent user", async () => {
      await request(app.getHttpServer())
        .get(`/api/users/user?id=${crypto.randomUUID()}`)
        .set("Cookie", cookies)
        .expect(404);
    });
  });

  describe("PATCH /users?id=:id", () => {
    it("should update user", async () => {
      const updateData = { email: "newemail@example.com" };
      const response = await request(app.getHttpServer())
        .patch(`/api/users?id=${testUser.id}`)
        .set("Cookie", cookies)
        .send(updateData)
        .expect(200);

      expect(response.body.data.email).toBe(updateData.email);
    });

    it("should return 403 when updating another user", async () => {
      const anotherUser = await authService.register({
        email: "another@example.com",
        password: "password123",
        firstName: "Another",
        lastName: "User",
      });
      await request(app.getHttpServer())
        .patch(`/api/users?id=${anotherUser.id}`)
        .set("Cookie", cookies)
        .send({ email: "newemail@example.com" })
        .expect(403);
    });
  });

  describe("PATCH /users/change-password?id=:id", () => {
    it("should change password when old password is correct", async () => {
      const newPassword = "newPassword123";

      await request(app.getHttpServer())
        .patch(`/api/users/change-password?id=${testUser.id}`)
        .set("Cookie", cookies)
        .send({ oldPassword: testPassword, newPassword })
        .expect(200);

      const loginResponse = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(201);

      expect(loginResponse.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 when old password is incorrect", async () => {
      const incorrectOldPassword = "wrongPassword";
      const newPassword = "newPassword123";

      await request(app.getHttpServer())
        .patch(`/api/users/change-password?id=${testUser.id}`)
        .set("Cookie", cookies)
        .send({ oldPassword: incorrectOldPassword, newPassword })
        .expect(401);
    });

    it("should return 403 when changing another user's password", async () => {
      const anotherUser = await authService.register({
        email: "another2@example.com",
        password: "password123",
        firstName: "Another",
        lastName: "User",
      });
      await request(app.getHttpServer())
        .patch(`/api/users/change-password?id=${anotherUser.id}`)
        .set("Cookie", cookies)
        .send({ oldPassword: "password123", newPassword: "newpassword" })
        .expect(403);
    });
  });

  describe("DELETE /users?id=:id", () => {
    it("should delete user", async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/user?id=${testUser.id}`)
        .set("Cookie", cookies)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/api/users/${testUser.id}`)
        .set("Cookie", cookies)
        .expect(404);
    });

    it("should return 403 when deleting another user", async () => {
      const anotherUser = await authService.register({
        email: "another3@example.com",
        password: "password123",
        firstName: "Another",
        lastName: "User",
      });
      await request(app.getHttpServer())
        .delete(`/api/users?id=${anotherUser.id}`)
        .set("Cookie", cookies)
        .expect(403);
    });
  });
});
