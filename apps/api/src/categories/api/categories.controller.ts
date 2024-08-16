import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/category.schema";
import {
  baseResponse,
  BaseResponse,
  paginatedResponse,
  PaginatedResponse,
  UUIDSchema,
} from "src/common";
import { CategoriesService } from "../categories.service";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserRole } from "src/users/schemas/user-roles";
import {
  CommonCategory,
  commonCategorySchema,
} from "../schemas/common-category.schema";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
    @Query("filter") filter: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: string,
    @CurrentUser("role") userRole: UserRole,
  ): Promise<PaginatedResponse<AllCategoriesResponse>> {
    const query = { filter, page, perPage, sort };

    const data = await this.categoriesService.getCategories(query, userRole);
    return new PaginatedResponse(data);
  }

  @Delete("/:id")
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(commonCategorySchema),
  })
  async archiveCategory(
    @Param("id") categoryId: string,
    @CurrentUser("role") userRole: UserRole,
  ): Promise<BaseResponse<CommonCategory>> {
    const category = await this.categoriesService.archiveCategory(
      categoryId,
      userRole,
    );

    return new BaseResponse(category);
  }
}
