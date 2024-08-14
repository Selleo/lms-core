import { count, like } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import {
  addPagination,
  DEFAULT_PAGE_SIZE,
  getSortOptions,
} from "src/common/pagination";
import { categories } from "src/storage/schema";
import { CategoriesQuery } from "./api/types";
import { CategoryQueries } from "./schemas/category-query";
import { DatabasePg } from "src/common";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";

@Injectable()
export class CategoriesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter.toLowerCase()}%`);
  }

  private getColumnToSortBy(sort: string, isAdmin: boolean) {
    if (!isAdmin) return categories.title;

    switch (sort) {
      case CategoryQueries.archivedAt:
        return categories.archivedAt;
      case CategoryQueries.createdAt:
        return categories.createdAt;
      default:
        return categories.title;
    }
  }

  public async getCategories(query: CategoriesQuery, userRole: UserRole) {
    const {
      sort = "",
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
        : {}),
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
}
