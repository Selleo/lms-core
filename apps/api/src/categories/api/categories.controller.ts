import { Controller, Get, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/category.schema";
import { paginatedResponse, PaginatedResponse } from "src/common";
import { CategoriesService } from "../categories.service";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserRole } from "src/users/schemas/user-roles";
import {
  SortCategoryQueryOptions,
  sortCategoryQueryOptions,
} from "../schemas/category-query";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Validate({
    response: paginatedResponse(allCategoriesSchema),
    request: [
      { type: "query", name: "filter", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCategoryQueryOptions },
    ],
  })
  async getAllCategories(
    @Query("filter") filter: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCategoryQueryOptions,
    @CurrentUser("role") userRole: UserRole,
  ): Promise<PaginatedResponse<AllCategoriesResponse>> {
    const query = { filter, page, perPage, sort };

    const data = await this.categoriesService.getCategories(query, userRole);
    return new PaginatedResponse(data);
  }
}
