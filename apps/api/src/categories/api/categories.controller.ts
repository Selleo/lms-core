import { Controller, Get, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import { paginatedResponse, PaginatedResponse } from "src/common";
import { CategorieService } from "../categories.service";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    response: paginatedResponse(allCategoriesSchema),
    request: [
      { type: "query", name: "filter", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number() },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: Type.String() },
    ],
  })
  async getAllCategories(
    @Query("filter") filter?: string,
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
    @Query("sort") sort?: string,
  ): Promise<PaginatedResponse<AllCategoriesResponse>> {
    const query = { filter, page, perPage, sort };

    const data = await this.categoriesService.getCategories(query);
    return new PaginatedResponse(data);
  }
}
