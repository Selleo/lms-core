import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { and, count, eq, ilike, like } from "drizzle-orm";

import { DatabasePg, type Pagination } from "src/common";
import { getSortOptions } from "src/common/helpers/getSortOptions";
import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import { categories } from "src/storage/schema";
import { UserRoles, type UserRole } from "src/users/schemas/user-roles";

import {
  type CategoryFilterSchema,
  type CategorySortField,
  CategorySortFields,
} from "./schemas/categoryQuery";

import type { CategoriesQuery } from "./api/categories.types";
import type { AllCategoriesResponse } from "./schemas/category.schema";
import type { CreateCategoryBody } from "./schemas/createCategorySchema";
import type { UpdateCategoryBody } from "./schemas/updateCategorySchema";

@Injectable()
export class CategoriesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  public async getCategories(
    query: CategoriesQuery,
    userRole: UserRole,
  ): Promise<{ data: AllCategoriesResponse; pagination: Pagination }> {
    const {
      sort = CategorySortFields.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filters = {},
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);

    const isAdmin = userRole === UserRoles.admin;

    const selectedColumns = {
      id: categories.id,
      archived: categories.archived,
      createdAt: categories.createdAt,
      title: categories.title,
    };

    return this.db.transaction(async (tx) => {
      const conditions = this.getFiltersConditions(filters);
      const queryDB = tx
        .select(selectedColumns)
        .from(categories)
        .where(and(...conditions))
        .orderBy(
          sortOrder(
            this.getColumnToSortBy(sortedField as CategorySortField, isAdmin),
          ),
        );

      const dynamicQuery = queryDB.$dynamic();

      const paginatedQuery = addPagination(dynamicQuery, page, perPage);

      const data = await paginatedQuery;

      const [{ totalItems }] = await tx
        .select({ totalItems: count() })
        .from(categories)
        .where(and(eq(categories.archived, false), ...conditions));

      return {
        data: this.serializeCategories(data, isAdmin),
        pagination: { totalItems: totalItems, page, perPage },
      };
    });
  }

  public async getCategoryById(id: string) {
    const [category] = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    return category;
  }

  public async createCategory(createCategoryBody: CreateCategoryBody) {
    const [newCategory] = await this.db
      .insert(categories)
      .values(createCategoryBody)
      .returning();

    if (!newCategory)
      throw new UnprocessableEntityException("Category not created");

    return newCategory;
  }

  public async updateCategory(
    id: string,
    updateCategoryBody: UpdateCategoryBody,
  ) {
    const [existingCategory] = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!existingCategory) {
      throw new NotFoundException("Category not found");
    }

    const [updatedCategory] = await this.db
      .update(categories)
      .set(updateCategoryBody)
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter.toLowerCase()}%`);
  }

  private getColumnToSortBy(sort: CategorySortField, isAdmin: boolean) {
    if (!isAdmin) return categories.title;

    switch (sort) {
      case CategorySortFields.creationDate:
        return categories.createdAt;
      default:
        return categories.title;
    }
  }

  private serializeCategories = (
    data: AllCategoriesResponse,
    isAdmin: boolean,
  ) =>
    data.map((category) => ({
      ...category,
      archived: isAdmin ? category.archived : null,
      createdAt: isAdmin ? category.createdAt : null,
    }));

  private getFiltersConditions(filters: CategoryFilterSchema) {
    const conditions = [];
    if (filters.title) {
      conditions.push(
        ilike(categories.title, `%${filters.title.toLowerCase()}%`),
      );
    }

    if (filters.archived) {
      conditions.push(eq(categories.archived, filters.archived === "true"));
    }

    return conditions;
  }
}
