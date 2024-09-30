import { count, like } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { addPagination, DEFAULT_PAGE_SIZE } from "src/common/pagination";
import type { AllCategoriesResponse } from "./schemas/category.schema";
import { categories } from "src/storage/schema";
import type { CategoriesQuery } from "./api/categories.types";
import {
  type CategorySortField,
  CategorySortFields,
} from "./schemas/categoryQuery";
import type { DatabasePg, Pagination } from "src/common";
import { type UserRole, UserRoles } from "src/users/schemas/user-roles";
import { getSortOptions } from "src/common/helpers/getSortOptions";

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
      filter = "",
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const filterCondition = this.createLikeFilter(filter);

    const isAdmin = userRole === UserRoles.admin;

    const selectedColumns = {
      id: categories.id,
      archived: categories.archived,
      createdAt: categories.createdAt,
      title: categories.title,
    };

    return this.db.transaction(async (tx) => {
      const queryDB = tx
        .select(selectedColumns)
        .from(categories)
        .where(filterCondition)
        .orderBy(
          sortOrder(
            this.getColumnToSortBy(sortedField as CategorySortField, isAdmin),
          ),
        );

      const dynamicQuery = queryDB.$dynamic();

      const paginatedQuery = addPagination(dynamicQuery, page, perPage);

      const data = await paginatedQuery;

      const [totalItems] = await tx
        .select({ count: count() })
        .from(categories)
        .where(filterCondition);

      return {
        data: this.serializeCategories(data, isAdmin),
        pagination: { totalItems: totalItems.count, page, perPage },
      };
    });
  }

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter.toLowerCase()}%`);
  }

  private getColumnToSortBy(sort: CategorySortField, isAdmin: boolean) {
    if (!isAdmin) return categories.title;

    switch (sort) {
      case CategorySortFields.archived:
        return categories.archived;
      case CategorySortFields.createdAt:
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
}
