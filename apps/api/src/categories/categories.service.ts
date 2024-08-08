import { asc, count, desc, like, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { DatabasePg } from "src/common";
import { TCategoriesQuery } from "./api/types";
import { categories } from "src/storage/schema";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  private createLikeFilter(filter: string) {
    return like(categories.title, `%${filter || "%"}%`);
  }

  public async getCategories(query: TCategoriesQuery) {
    const filterCondition = this.createLikeFilter(query?.filter);
    const sortOrder = query.sort.startsWith("-") ? desc : asc;
    const orderBy = [sortOrder(sql`LOWER(${categories.title})`)];

    const [totalItems] = await this.db
      .select({ count: count() })
      .from(categories)
      .where(filterCondition);

    const allCategories = await this.db.query.categories.findMany({
      columns: {
        id: true,
        title: true,
      },
      where: filterCondition,
      orderBy,
      limit: +query?.limit,
      offset: +query?.offset,
    });

    return { categories: allCategories, totalItems: totalItems.count };
  }
}
