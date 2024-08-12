import { count, like, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { DatabasePg } from "src/common";
import { CategoriesQuery } from "./api/types";
import { categories } from "src/storage/schema";
import {
  addPagination,
  DEFAULT_PAGINATION_LIMIT,
  getPageAndPageSize,
  getSortOptions,
} from "src/utils/pagination";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter}%`);
  }

  public async getCategories(query: CategoriesQuery) {
    const {
      sort = "",
      limit = DEFAULT_PAGINATION_LIMIT,
      offset = 0,
      filter = "",
    } = query;

    const { sortOrder } = getSortOptions(sort);
    const filterCondition = this.createLikeFilter(filter);

    const queryDB = this.db
      .select()
      .from(categories)
      .where(filterCondition)
      .orderBy(sortOrder(sql`LOWER(${categories.title})`));

    const { pageSize, page } = getPageAndPageSize({ limit, offset });

    const paginatedData = addPagination({ queryDB, page, pageSize });

    const data = await paginatedData;

    const [totalItems] = await this.db
      .select({ count: count() })
      .from(categories)
      .where(filterCondition);

    return {
      categories: data,
      pagination: { totalItems: totalItems.count, page, pageSize },
    };
  }
}
