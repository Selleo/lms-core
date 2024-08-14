import { createCategoryFactory } from "../../../test/factory/category.factory";
import { createE2ETest } from "../../../test/create-e2e-test";
import {
  createUserFactory,
  UserWithCredentials,
} from "../../../test/factory/user.factory";
import { DatabasePg } from "src/common";
import { INestApplication } from "@nestjs/common";
import { UserRole } from "src/users/schemas/user-roles";
import request from "supertest";

const CATEGORIES_COUNT = 10;

describe("CategoriesController (e2e)", () => {
  const testPassword = "password123";
  let app: INestApplication;
  let categoryFactory: ReturnType<typeof createCategoryFactory>;
  let db: DatabasePg;
  let testUser: UserWithCredentials;
  let userFactory: ReturnType<typeof createUserFactory>;

  beforeAll(async () => {
    const { app: testApp } = await createE2ETest();
    app = testApp;
    db = app.get("DB");
    userFactory = createUserFactory(db);
    categoryFactory = createCategoryFactory(db);
    Array.from({ length: CATEGORIES_COUNT }, () => categoryFactory.create());
  }, 30000);

  const getCookie = async (role: UserRole) => {
    testUser = await userFactory
      .withCredentials({ password: testPassword })
      .create({ role });

    const loginResponse = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.credentials?.password,
      });

    return loginResponse.headers["set-cookie"];
  };

  describe("POST /categories", () => {
    it("should return all categories for student role (only 'id' and 'title')", async () => {
      const response = await request(app.getHttpServer())
        .get("/categories")
        .set("Cookie", await getCookie("student"))
        .expect(200);

      const responseData = response.body.data;

      expect(responseData[0]).toHaveProperty("id");
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[0]).not.toHaveProperty("archivedAt");
      expect(responseData[0]).not.toHaveProperty("createdAt");
    });

    it("should return all categories for admin role (all columns)", async () => {
      const response = await request(app.getHttpServer())
        .get("/categories")
        .set("Cookie", await getCookie("admin"))
        .expect(200);

      const responseData = response.body.data;

      expect(responseData[0]).toHaveProperty("id");
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[0]).toHaveProperty("archivedAt");
      expect(responseData[0]).toHaveProperty("createdAt");
    });

    it("should pagination work", async () => {
      let perPage = 5;
      let page = 1;

      const response = await request(app.getHttpServer())
        .get(`/categories?perPage=${perPage}&page=${page}`)
        .set("Cookie", await getCookie("student"))
        .expect(200);

      const paginationData = response.body.pagination;

      expect(response.body.data).toHaveLength(perPage);
      expect(paginationData.totalItems).toBe(CATEGORIES_COUNT);
      expect(paginationData.page).toBe(page);
      expect(paginationData.perPage).toBe(perPage);

      perPage = 8;
      page = 2;

      const res = await request(app.getHttpServer())
        .get(`/categories?perPage=${perPage}&page=${page}`)
        .set("Cookie", await getCookie("student"))
        .expect(200);

      expect(res.body.data).toHaveLength(CATEGORIES_COUNT - perPage);
      expect(res.body.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });
  });
});
