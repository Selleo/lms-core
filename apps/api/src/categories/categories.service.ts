import { count, like, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import {
  addPagination,
  DEFAULT_PAGE_SIZE,
  getSortOptions,
} from "src/common/pagination";
import { categories } from "src/storage/schema";
import { CategoriesQuery } from "./api/types";
import { DatabasePg } from "src/common";
import { UserRole, UserRoles } from "src/users/schemas/user-roles";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter}%`);
  }

  public async getCategories(query: CategoriesQuery, userRole: UserRole) {
    const {
      sort = "",
      perPage = DEFAULT_PAGE_SIZE,
      page = 1,
      filter = "",
    } = query;

    const { sortOrder } = getSortOptions(sort);
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
        .orderBy(sortOrder(sql`LOWER(${categories.title})`));

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
