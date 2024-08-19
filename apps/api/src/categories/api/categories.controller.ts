import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
  categorySchema,
  CategorySchema,
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
import { Admin } from "src/common/decorators/admin.decorator";

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

  @Post("/:id")
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(categorySchema),
  })
  async updateCategory(
    @Param("id") categoryId: string,
    @CurrentUser("role") userRole: UserRole,
    @Body() categoryData: Pick<CommonCategory, "title">,
  ): Promise<BaseResponse<CategorySchema>> {
    const category = await this.categoriesService.updateCategory(
      categoryId,
      categoryData,
      userRole,
    );

    return new BaseResponse(category);
  }

  @Delete("/:id")
  @Admin()
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(commonCategorySchema),
  })
  async archiveCategory(
    @Param("id") categoryId: string,
  ): Promise<BaseResponse<CommonCategory>> {
    const category = await this.categoriesService.archiveCategory(categoryId);

    return new BaseResponse(category);
  }
}
