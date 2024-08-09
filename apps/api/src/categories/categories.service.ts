// import { asc, count, desc, like, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";

import { DatabasePg } from "src/common";
import { CategoriesQuery } from "./api/types";
import { categories, users } from "src/storage/schema";
import { getDataPagination } from "src/utils/pagination";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  // private createLikeFilter(filter: string) {
  //   return like(categories.title, `%${filter}%`);
  // }

  public async getCategories(query: CategoriesQuery) {
    // const { sort = "", limit = 10, offset = 0, filter = "" } = query;

    // const sortOrder = sort.startsWith("-") ? desc : asc;
    // const filterCondition = this.createLikeFilter(query.filter as string);

    // const queryDB = this.db
    //   .select()
    //   .from(categories)
    //   .where(like(categories.title, `%${filter}%`))
    //   .orderBy(sortOrder(sql`LOWER(${categories.title})`))
    //   .limit(limit)
    //   .offset(offset);

    // const data = await queryDB;

    // const [totalItems] = await this.db
    //   .select({ count: count() })
    //   .from(categories)
    //   .where(filterCondition);

    //---- external function ------
    const data = await getDataPagination({
      model: categories,
      query,
      db: this.db,
    });
    //-----------------------
    return { categories: data.categories, totalItems: data.totalItems };
  }
}
