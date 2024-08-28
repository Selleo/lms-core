import { createUnitTest, TestContext } from "test/create-unit-test";
import { CategoriesService } from "../categories.service";
import { DatabasePg } from "src/common";
import { truncateAllTables } from "test/helpers/test-helpers";
import { createCategoryFactory } from "test/factory/category.factory";
import { CategoriesQuery } from "../api/categoires.types";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";
import { DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { categories } from "src/storage/schema";

const CATEGORIES_COUNT = 20;

describe("CategoriesService", () => {
  let testContext: TestContext;
  let categoriesServics: CategoriesService;
  let db: DatabasePg;
  let categoryFactory: ReturnType<typeof createCategoryFactory>;
  let query: CategoriesQuery;
  let userRole: UserRole;

  beforeAll(async () => {
    testContext = await createUnitTest();
    categoriesServics = testContext.module.get(CategoriesService);
    db = testContext.db;
    categoryFactory = createCategoryFactory(db);
    categoryFactory.createList(CATEGORIES_COUNT);
  }, 30000);

  afterAll(async () => {
    await truncateAllTables(db);
    await testContext.teardown();
  });

  describe("getCategories", () => {
    it("should return correct data format when the request don't provide any query params", async () => {
      userRole = UserRoles.student;
      query = {};
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toBeDefined();
      expect(categories.pagination).toBeDefined();
      expect(categories.pagination.page).toBeDefined();
      expect(categories.pagination.perPage).toBeDefined();
      expect(categories.pagination.totalItems).toBeDefined();
    });

    it("should get all categories with default pagination data when the request don't provide any query params", async () => {
      query = {};
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(DEFAULT_PAGE_SIZE);
      expect(categories.pagination.page).toBe(1);
      expect(categories.pagination.perPage).toBe(DEFAULT_PAGE_SIZE);
      expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should get correct pagination data when the request specifies it in the query params", async () => {
      const perPage = 5;
      const page = 2,
        query = { page, perPage };
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(perPage);
      expect(categories.pagination.page).toBe(page);
      expect(categories.pagination.perPage).toBe(perPage);
      expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should return empty array when there is no data", async () => {
      await truncateAllTables(db);
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(0);
      expect(categories.data).toBeDefined();
    });

    it("should sort data by default when no query params are provided", async () => {
      query = {};
      const historyCategory = categoryFactory.build({ title: "history" });
      const biologyCategory = categoryFactory.build({ title: "biology" });
      const mathCategory = categoryFactory.build({ title: "math" });
      await db
        .insert(categories)
        .values([historyCategory, biologyCategory, mathCategory]);
      const sortedCategories = await categoriesServics.getCategories(
        query,
        userRole,
      );

      expect(sortedCategories.data[0].title).toBe(biologyCategory.title);
    });

    it("should apply filters when the request provides one", async () => {
      query = { filter: "ath" };
      const filterCategories = await categoriesServics.getCategories(
        query,
        userRole,
      );
      expect(filterCategories.data[0].title).toBe("math");
      expect(filterCategories.data).toHaveLength(1);
    });
  });
});
