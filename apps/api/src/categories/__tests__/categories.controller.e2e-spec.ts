import request from "supertest";

import { UserRoles } from "src/users/schemas/user-roles";

import { createE2ETest } from "../../../test/create-e2e-test";
import { createCategoryFactory } from "../../../test/factory/category.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { cookieFor, truncateAllTables } from "../../../test/helpers/test-helpers";

import type { INestApplication } from "@nestjs/common";
import type { DatabasePg } from "src/common";

const CATEGORIES_COUNT = 10;

describe("CategoriesController (e2e)", () => {
  let app: INestApplication;
  let categoryFactory: ReturnType<typeof createCategoryFactory>;
  let db: DatabasePg;
  let userFactory: ReturnType<typeof createUserFactory>;

  beforeAll(async () => {
    const { app: testApp } = await createE2ETest();
    app = testApp;
    db = app.get("DB");
    userFactory = createUserFactory(db);
    categoryFactory = createCategoryFactory(db);
    categoryFactory.createList(CATEGORIES_COUNT);
  }, 30000);

  afterAll(async () => {
    await truncateAllTables(db);
  });

  const password = "password123";

  describe("POST /api/categories", () => {
    describe("when user is a student", () => {
      it("returns archived and createdAt equal to null", async () => {
        const user = await userFactory
          .withCredentials({ password })
          .create({ role: UserRoles.student });

        const response = await request(app.getHttpServer())
          .get("/api/categories")
          .set("Cookie", await cookieFor(user, app))
          .expect(200);

        const responseData = response.body.data;

        expect(responseData[0]).toHaveProperty("id");
        expect(responseData[0]).toHaveProperty("title");
        expect(responseData[0].archived).toBe(null);
        expect(responseData[0].createdAt).toBe(null);
      });
    });

    describe("when user is an admin", () => {
      it("returns all filled category columns", async () => {
        const user = await userFactory
          .withCredentials({ password })
          .create({ role: UserRoles.admin });

        const response = await request(app.getHttpServer())
          .get("/api/categories")
          .set("Cookie", await cookieFor(user, app))
          .expect(200);

        const responseData = response.body.data;

        expect(responseData[0]).toHaveProperty("id");
        expect(responseData[0]).toHaveProperty("title");
        expect(responseData[0]).toHaveProperty("archived");
        expect(responseData[0]).toHaveProperty("createdAt");
        expect(responseData[0].createdAt).not.toBe(null);
      });
    });

    describe("when the request includes query params", () => {
      it("returns categories properly paginated", async () => {
        let perPage = 5;
        let page = 1;
        const user = await userFactory
          .withCredentials({ password })
          .create({ role: UserRoles.student });

        const response = await request(app.getHttpServer())
          .get(`/api/categories?perPage=${perPage}&page=${page}`)
          .set("Cookie", await cookieFor(user, app))
          .expect(200);

        const paginationData = response.body.pagination;

        expect(response.body.data).toHaveLength(perPage);
        expect(paginationData.totalItems).toBe(CATEGORIES_COUNT);
        expect(paginationData.page).toBe(page);
        expect(paginationData.perPage).toBe(perPage);

        perPage = 8;
        page = 2;

        const res = await request(app.getHttpServer())
          .get(`/api/categories?perPage=${perPage}&page=${page}`)
          .set("Cookie", await cookieFor(user, app))
          .expect(200);

        expect(res.body.data).toHaveLength(CATEGORIES_COUNT - perPage);
        expect(res.body.pagination.totalItems).toBe(CATEGORIES_COUNT);
      });
    });

    describe("when the request is unauthenticated", () => {
      it("returns 401 ", async () => {
        await request(app.getHttpServer()).get("/api/categories").expect(401);
      });
    });
  });
});
