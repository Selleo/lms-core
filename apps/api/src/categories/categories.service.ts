import { asc, desc } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { DatabasePg } from "src/common";
import { TCategoriesQuery } from "./api/types";
import { categories } from "src/storage/schema";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}
  public async getCategories(query: TCategoriesQuery) {
    const allCategories = await this.db.query.categories.findMany({
      where: (categories, { like }) =>
        like(categories.title, `%${query?.filter || "%"}%`),
      limit: +query?.limit,
      offset: +query?.offset,
      orderBy: query.sort.startsWith("-")
        ? [desc(categories.title)]
        : [asc(categories.title)],
    });

    return allCategories;
  }
}
