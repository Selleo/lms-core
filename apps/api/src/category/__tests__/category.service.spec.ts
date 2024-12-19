import { DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { categories } from "src/storage/schema";
import { USER_ROLES } from "src/user/schemas/userRoles";
import { createUnitTest, type TestContext } from "test/create-unit-test";
import { createCategoryFactory } from "test/factory/category.factory";
import { truncateAllTables } from "test/helpers/test-helpers";

import { CategoryService } from "../category.service";

import type { CategoryQuery } from "../schemas/category.types";
import type { DatabasePg } from "src/common";
import type { UserRole } from "src/user/schemas/userRoles";

const CATEGORIES_COUNT = 20;

describe("CategoryService", () => {
  let testContext: TestContext;
  let categoryServices: CategoryService;
  let db: DatabasePg;
  let categoryFactory: ReturnType<typeof createCategoryFactory>;
  let query: CategoryQuery;
  let userRole: UserRole;

  beforeAll(async () => {
    testContext = await createUnitTest();
    categoryServices = testContext.module.get(CategoryService);
    db = testContext.db;
    categoryFactory = createCategoryFactory(db);
    await categoryFactory.createList(CATEGORIES_COUNT);
  }, 30000);

  afterAll(async () => {
    await truncateAllTables(db);
    await testContext.teardown();
  });

  describe("getCategories", () => {
    describe("when the request specifies the pagination params", () => {
      it("returns correct pagination data", async () => {
        userRole = USER_ROLES.STUDENT;
        const perPage = 5;
        const page = 2,
          query = { page, perPage };
        const categories = await categoryServices.getCategories(query, userRole);

        expect(categories.data).toHaveLength(perPage);
        expect(categories.pagination.page).toBe(page);
        expect(categories.pagination.perPage).toBe(perPage);
        expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
      });
    });

    describe("when request don't provide any query params", () => {
      it("returns correct data format", async () => {
        query = {};
        const categories = await categoryServices.getCategories(query, userRole);

        expect(categories.data).toBeDefined();
        expect(categories.pagination).toBeDefined();
        expect(categories.pagination.page).toBeDefined();
        expect(categories.pagination.perPage).toBeDefined();
        expect(categories.pagination.totalItems).toBeDefined();
      });

      it("returns all categories with default pagination data", async () => {
        query = {};
        const categories = await categoryServices.getCategories(query, userRole);

        expect(categories.data).toHaveLength(DEFAULT_PAGE_SIZE);
        expect(categories.pagination.page).toBe(1);
        expect(categories.pagination.perPage).toBe(DEFAULT_PAGE_SIZE);
        expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
      });

      it("returns sorted data by default", async () => {
        query = {};
        await truncateAllTables(db);
        const historyCategory = categoryFactory.build({ title: "history" });
        const biologyCategory = categoryFactory.build({ title: "biology" });
        const mathCategory = categoryFactory.build({ title: "math" });
        await db.insert(categories).values([historyCategory, biologyCategory, mathCategory]);
        const sortedCategories = await categoryServices.getCategories(query, userRole);

        expect(sortedCategories.data[0].title).toBe(biologyCategory.title);
      });
    });

    describe("when the request includes filters", () => {
      it("returns filterd data", async () => {
        await truncateAllTables(db);
        const historyCategory = categoryFactory.build({ title: "history" });
        const biologyCategory = categoryFactory.build({ title: "biology" });
        const mathCategory = categoryFactory.build({ title: "math" });
        await db.insert(categories).values([historyCategory, biologyCategory, mathCategory]);
        query = { filters: { title: "ath" } };
        const filterCategories = await categoryServices.getCategories(query, userRole);
        expect(filterCategories.data[0].title).toBe("math");
        expect(filterCategories.data).toHaveLength(1);
      });
    });

    describe("when there is no data", () => {
      it("returns empty array", async () => {
        await truncateAllTables(db);
        const categories = await categoryServices.getCategories(query, userRole);

        expect(categories.data).toHaveLength(0);
        expect(categories.data).toBeDefined();
      });
    });
  });
});
