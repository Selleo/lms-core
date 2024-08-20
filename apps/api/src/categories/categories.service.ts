import { count, like } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import {
  addPagination,
  DEFAULT_PAGE_SIZE,
  getSortOptions,
} from "src/common/pagination";
import { AllCategoriesResponse } from "./schemas/category.schema";
import { categories } from "src/storage/schema";
import { CategoriesQuery } from "./api/categoires.types";
import {
  CategorySortQueries,
  CategorySortQuery,
} from "./schemas/category-query";
import { DatabasePg, Pagination } from "src/common";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";

@Injectable()
export class CategoriesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  public async getCategories(
    query: CategoriesQuery,
    userRole: UserRole,
  ): Promise<{ data: AllCategoriesResponse; pagination: Pagination }> {
    const {
      sort = CategorySortQueries.title,
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filter = "",
    } = query;

    const { sortOrder, sortedField } = getSortOptions(sort);
    const filterCondition = this.createLikeFilter(filter);

    const isAdmin = userRole === UserRoles.admin;

    const selectedColumns = {
      id: categories.id,
      title: categories.title,
      ...(isAdmin
        ? { archivedAt: categories.archivedAt, createdAt: categories.createdAt }
        : null),
    };

    return this.db.transaction(async (tx) => {
      const queryDB = tx
        .select(selectedColumns)
        .from(categories)
        .where(filterCondition)
        .orderBy(sortOrder(this.getColumnToSortBy(sortedField, isAdmin)));

      const paginatedQuery = addPagination({ queryDB, page, perPage });

      const data = await paginatedQuery;

      const [totalItems] = await tx
        .select({ count: count() })
        .from(categories)
        .where(filterCondition);

      return {
        data,
        pagination: { totalItems: totalItems.count, page, perPage },
      };
    });
  }

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter.toLowerCase()}%`);
  }

  private getColumnToSortBy(sort: CategorySortQuery, isAdmin: boolean) {
    if (!isAdmin) return categories.title;

    switch (sort) {
      case CategorySortQueries.archivedAt:
        return categories.archivedAt;
      case CategorySortQueries.createdAt:
        return categories.createdAt;
      default:
        return categories.title;
    }
  }
}
