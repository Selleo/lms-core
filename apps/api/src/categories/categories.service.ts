import { asc, count, desc, like } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { DatabasePg } from "src/common";
import { TCategoriesQuery } from "./api/types";
import { categories } from "src/storage/schema";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}
  public async getCategories(query: TCategoriesQuery) {
    const [totalItems] = await this.db
      .select({ count: count() })
      .from(categories)
      .where(like(categories.title, `%${query?.filter || "%"}%`));

    const allCategories = await this.db.query.categories.findMany({
      columns: {
        id: true,
        title: true,
      },
      where: (categories, { like }) =>
        like(categories.title, `%${query?.filter || "%"}%`),
      orderBy: query.sort.startsWith("-")
        ? [desc(categories.title)]
        : [asc(categories.title)],
      limit: +query?.limit,
      offset: +query?.offset,
    });

    return { categories: allCategories, totalItems: totalItems.count };
  }
}
