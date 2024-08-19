import { createUnitTest, TestContext } from "test/create-unit-test";
import { CategoriesService } from "../categories.service";
import { DatabasePg } from "src/common";
import { truncateAllTables } from "test/helpers/test-helpers";
import { createCategoryFactory } from "test/factory/category.factory";
import { CategoriesQuery } from "../api/types";
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
    const newCategories = Array.from({ length: CATEGORIES_COUNT }, () =>
      categoryFactory.build(),
    );
    await db.insert(categories).values(newCategories);
  }, 30000);

  afterAll(async () => {
    await truncateAllTables(db);
    await testContext.teardown();
  });

  describe("getCategories", () => {
    it("should return correct data format", async () => {
      userRole = UserRoles.student;
      query = {};
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toBeDefined();
      expect(categories.pagination).toBeDefined();
      expect(categories.pagination.page).toBeDefined();
      expect(categories.pagination.perPage).toBeDefined();
      expect(categories.pagination.totalItems).toBeDefined();
    });

    it("should get all categories with default pagination data", async () => {
      userRole = UserRoles.student;
      query = {};
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(DEFAULT_PAGE_SIZE);
      expect(categories.pagination.page).toBe(1);
      expect(categories.pagination.perPage).toBe(DEFAULT_PAGE_SIZE);
      expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should get all categories with specifed pagination data", async () => {
      const perPage = 5;
      const page = 2,
        query = { page, perPage };
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(perPage);
      expect(categories.pagination.page).toBe(page);
      expect(categories.pagination.perPage).toBe(perPage);
      expect(categories.pagination.totalItems).toBe(CATEGORIES_COUNT);
    });

    it("should return empty array if no data", async () => {
      await truncateAllTables(db);
      const categories = await categoriesServics.getCategories(query, userRole);

      expect(categories.data).toHaveLength(0);
      expect(categories.data).toBeDefined();
    });

    it("should sort data by default", async () => {
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

    it("should filter works", async () => {
      query = { filter: "ath" };
      const filterCategories = await categoriesServics.getCategories(
        query,
        userRole,
      );
      expect(filterCategories.data[0].title).toBe("math");
      expect(filterCategories.data).toHaveLength(1);
    });
  });

  describe("archiveCategory", () => {
    it("admin can archive a category", async () => {
      const cat = await db.select().from(categories);
      const result = await categoriesServics.archiveCategory(cat[0].id);
      expect(result.archivedAt).not.toBeNull();
    });
  });

  describe("updateCategory", () => {
    it("should update a categry", async () => {
      const allCategories = await db.select().from(categories);
      const categoryToUpdate = allCategories[0];
      const newTitle = categoryToUpdate.title + "asdf";

      const result = await categoriesServics.updateCategory(
        categoryToUpdate.id,
        { title: newTitle },
        UserRoles.admin,
      );

      expect(result.title).toBe(newTitle);
    });
  });
});
