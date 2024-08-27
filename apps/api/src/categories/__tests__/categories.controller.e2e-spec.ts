import { createCategoryFactory } from "../../../test/factory/category.factory";
import { createE2ETest } from "../../../test/create-e2e-test";
import { createUserFactory } from "../../../test/factory/user.factory";
import { DatabasePg } from "src/common";
import { INestApplication } from "@nestjs/common";
import { authAs, truncateAllTables } from "../../../test/helpers/test-helpers";
import { UserRoles } from "src/users/schemas/user-roles";
import request from "supertest";

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

  describe("POST /api/categories", () => {
    it("should return archived and createdAt equal to null for student role", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/categories")
        .set("Cookie", await authAs(UserRoles.student, userFactory, app))
        .expect(200);

      const responseData = response.body.data;

      expect(responseData[0]).toHaveProperty("id");
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[0].archived).toBe(null);
      expect(responseData[0].createdAt).toBe(null);
    });

    it("should return all categories for admin role (all columns)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/categories")
        .set("Cookie", await authAs(UserRoles.admin, userFactory, app))
        .expect(200);

      const responseData = response.body.data;

      expect(responseData[0]).toHaveProperty("id");
      expect(responseData[0]).toHaveProperty("title");
      expect(responseData[0]).toHaveProperty("archived");
      expect(responseData[0]).toHaveProperty("createdAt");
      expect(responseData[0].createdAt).not.toBe(null);
    });

    it("should return categories properly paginated", async () => {
      let perPage = 5;
      let page = 1;

      const response = await request(app.getHttpServer())
        .get(`/api/categories?perPage=${perPage}&page=${page}`)
        .set("Cookie", await authAs(UserRoles.student, userFactory, app))
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
        .set("Cookie", await authAs(UserRoles.student, userFactory, app))
        .expect(200);

      expect(res.body.data).toHaveLength(CATEGORIES_COUNT - perPage);
      expect(res.body.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should return 401 for unauthenticated request", async () => {
      await request(app.getHttpServer()).get("/api/categories").expect(401);
    });
  });
});
