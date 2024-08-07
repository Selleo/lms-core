import { Inject, Injectable } from "@nestjs/common";

import { categories } from "src/storage/schema";
import { DatabasePg } from "src/common";

@Injectable()
export class CategorieService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  public async getCategories() {
    const allCategories = await this.db.select().from(categories);

    return allCategories;
  }
}
