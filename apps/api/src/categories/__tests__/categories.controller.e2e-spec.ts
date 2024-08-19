import { categories } from "src/storage/schema";
import { createCategoryFactory } from "../../../test/factory/category.factory";
import { createE2ETest } from "../../../test/create-e2e-test";
import {
  createUserFactory,
  UserWithCredentials,
} from "../../../test/factory/user.factory";
import { DatabasePg } from "src/common";
import { eq, sql } from "drizzle-orm";
import { INestApplication } from "@nestjs/common";
import { truncateAllTables } from "../../../test/helpers/test-helpers";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";
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
  }, 30000);

  beforeEach(async () => {
    categoryFactory = createCategoryFactory(db);
    Array.from({ length: CATEGORIES_COUNT }, () => categoryFactory.create());
  });

  afterEach(async () => {
    await truncateAllTables(db);
  });

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
        .set("Cookie", await getCookie(UserRoles.student))
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
        .set("Cookie", await getCookie(UserRoles.admin))
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
        .set("Cookie", await getCookie(UserRoles.student))
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
        .set("Cookie", await getCookie(UserRoles.student))
        .expect(200);

      expect(res.body.data).toHaveLength(CATEGORIES_COUNT - perPage);
      expect(res.body.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should return 401 for unauthenticated request", async () => {
      await request(app.getHttpServer()).get("/categories").expect(401);
    });

    it("should return archived categories only for admins", async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      const categoryToArchive = response.body.data[0];

      await db
        .update(categories)
        .set({ archivedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(categories.id, categoryToArchive.id));

      const studentResponse = await request(app.getHttpServer())
        .get(`/categories`)
        .set("Cookie", await getCookie(UserRoles.student))
        .expect(200);

      expect(studentResponse.body.data).toHaveLength(CATEGORIES_COUNT - 1);

      const adminResponse = await request(app.getHttpServer())
        .get(`/categories`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      expect(adminResponse.body.data).toHaveLength(CATEGORIES_COUNT);
    });
  });

  describe("DELETE categories/:id", () => {
    it("should archive a category", async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      const categoryToArchive = response.body.data[0];

      expect(categoryToArchive.archivedAt).toBeNull();

      await request(app.getHttpServer())
        .delete(`/categories/${categoryToArchive.id}`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      const [archivedCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryToArchive.id));

      expect(archivedCategory.archivedAt).not.toBeNull();
    });

    it("should allow only admins to archive category", async () => {
      const cat = await db.select().from(categories);

      await request(app.getHttpServer())
        .delete(`/categories/${cat[0].id}`)
        .set("Cookie", await getCookie(UserRoles.student))
        .expect(403);
    });

    it("it should throw an error if a category is already archived", async () => {
      const cat = await db.select().from(categories);
      await db
        .update(categories)
        .set({ archivedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(categories.id, cat[0].id));

      await request(app.getHttpServer())
        .delete(`/categories/${cat[0].id}`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(422);
    });

    it("it should throw an 404 if a category is not exist", async () => {
      await request(app.getHttpServer())
        .delete(`/categories/f8070242-b0c0-45e3-86fd-04bf74adcaa1`)
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(404);
    });
  });

  describe("POST categories/:id", () => {
    it("should update a category title", async () => {
      const response = await request(app.getHttpServer())
        .get("/categories")
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      const categoryToUpdate = response.body.data[1];
      const newTitle = categoryToUpdate.title + "asdf";

      const updateResponse = await request(app.getHttpServer())
        .post(`/categories/${categoryToUpdate.id}`)
        .send({
          title: newTitle,
        })
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(201);

      expect(updateResponse.body.data.title).toBe(newTitle);
      expect(updateResponse.body.data.id).toBe(categoryToUpdate.id);
    });

    it("should throw an error when not admin try to update a category", async () => {
      const response = await request(app.getHttpServer())
        .get("/categories")
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(200);

      const categoryToUpdate = response.body.data[0];
      const newTitle = categoryToUpdate.title + "asdf";

      await request(app.getHttpServer())
        .post(`/categories/${categoryToUpdate.id}`)
        .send({
          title: newTitle,
        })
        .set("Cookie", await getCookie(UserRoles.student))
        .expect(403);
    });

    it("it should throw an 404 if a category is not exist", async () => {
      await request(app.getHttpServer())
        .post(`/categories/f8070242-b0c0-45e3-86fd-04bf74adcaa1`)
        .send({
          title: "Some title",
        })
        .set("Cookie", await getCookie(UserRoles.admin))
        .expect(404);
    });
  });
});
