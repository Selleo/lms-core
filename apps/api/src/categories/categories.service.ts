import { and, count, eq, isNull, like, sql } from "drizzle-orm";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";

import {
  addPagination,
  DEFAULT_PAGE_SIZE,
  getSortOptions,
} from "src/common/pagination";
import { categories } from "src/storage/schema";
import { CategoriesQuery } from "./api/types";
import { CategoryQueries } from "./schemas/category-query";
import { CommonCategory } from "./schemas/common-category.schema";
import { DatabasePg } from "src/common";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";

@Injectable()
export class CategoriesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createCategoriesFilters(filter: string, isAdmin: boolean) {
    return and(
      like(categories.title, `%${filter.toLowerCase()}%`),
      isAdmin ? undefined : isNull(categories.archivedAt),
    );
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
    const isAdmin = userRole === UserRoles.admin;
    const filterCondition = this.createCategoriesFilters(filter, isAdmin);

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

  public async archiveCategory(categoryId: string) {
    return this.db.transaction(async (tx) => {
      const [category] = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new HttpException(
          "Category does not exist",
          HttpStatus.NOT_FOUND,
        );
      }

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

  public async updateCategory(
    categoryId: string,
    categoryData: Pick<CommonCategory, "title">,
  ) {
    return this.db.transaction(async (tx) => {
      const [category] = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new HttpException(
          "Category does not exist",
          HttpStatus.NOT_FOUND,
        );
      }

      const [updatedCategory] = await tx
        .update(categories)
        .set({ title: categoryData.title })
        .where(eq(categories.id, categoryId))
        .returning({ title: categories.title, id: categories.id });

      return updatedCategory;
    });
  }
}
