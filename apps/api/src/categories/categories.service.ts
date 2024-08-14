import { count, eq, like, sql } from "drizzle-orm";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";

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

  public async archiveCategory(categoryId: string, userRole: UserRole) {
    if (userRole !== UserRoles.admin) {
      throw new HttpException(
        "Only admins can archive the category",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.db.transaction(async (tx) => {
      const [category] = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (category.archivedAt) {
        throw new HttpException(
          "Category already archived",
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const [updatedCategory] = await tx
        .update(categories)
        .set({ archivedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(categories.id, categoryId))
        .returning();

      return updatedCategory;
    });
  }
}
