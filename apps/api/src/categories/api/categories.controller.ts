import { Controller, Get, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import {
  basePaginatedResponse,
  BasePaginatedResponse,
  BasePagination,
} from "src/common";
import { CategorieService } from "../categories.service";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    response: basePaginatedResponse(allCategoriesSchema),
    request: [
      { type: "query", name: "filter", schema: Type.String() },
      { type: "query", name: "limit", schema: Type.Number() },
      { type: "query", name: "offset", schema: Type.Number() },
      { type: "query", name: "sort", schema: Type.String() },
    ],
  })
  async getAllCategories(
    @Query("filter") filter?: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("sort") sort?: string,
  ): Promise<BasePaginatedResponse<AllCategoriesResponse, BasePagination>> {
    const query = { filter, limit, offset, sort };
    const data = await this.categoriesService.getCategories(query);

    return new BasePaginatedResponse(data.categories, data.pagination);
  }
}
