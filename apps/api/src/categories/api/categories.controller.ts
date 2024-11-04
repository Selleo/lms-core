import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  paginatedResponse,
  PaginatedResponse,
  UUIDSchema,
  type UUIDType,
} from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import type { UserRole } from "src/users/schemas/user-roles";
import { CategoriesService } from "../categories.service";
import {
  type AllCategoriesResponse,
  type CategorySchema,
  categorySchema,
} from "../schemas/category.schema";
import {
  type SortCategoryFieldsOptions,
  sortCategoryFieldsOptions,
} from "../schemas/categoryQuery";
import {
  type CreateCategoryBody,
  createCategorySchema,
} from "../schemas/createCategorySchema";
import {
  type UpdateCategoryBody,
  updateCategorySchema,
} from "../schemas/updateCategorySchema";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Validate({
    response: paginatedResponse(Type.Array(categorySchema)),
    request: [
      { type: "query", name: "title", schema: Type.String() },
      { type: "query", name: "archived", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCategoryFieldsOptions },
    ],
  })
  async getAllCategories(
    @Query("title") title: string,
    @Query("archived") archived: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCategoryFieldsOptions,
    @CurrentUser("role") userRole: UserRole,
  ): Promise<PaginatedResponse<AllCategoriesResponse>> {
    const filters = { archived, title };
    const query = { filters, page, perPage, sort };

    const data = await this.categoriesService.getCategories(query, userRole);

    return new PaginatedResponse(data);
  }

  @Get(":id")
  @Validate({
    response: baseResponse(categorySchema),
    request: [{ type: "param", name: "id", schema: Type.String() }],
  })
  async getCategoryById(
    @Query("id") id: string,
    @CurrentUser() currentUser: { role: string },
  ): Promise<BaseResponse<CategorySchema>> {
    if (currentUser.role !== "admin") {
      throw new UnauthorizedException(
        "You don't have permission to get category",
      );
    }

    const category = await this.categoriesService.getCategoryById(id);

    return new BaseResponse(category);
  }

  @Post()
  @Validate({
    request: [
      {
        type: "body",
        schema: createCategorySchema,
      },
    ],
    response: baseResponse(
      Type.Object({ id: UUIDSchema, message: Type.String() }),
    ),
  })
  async createCategory(
    @Body() createCategoryBody: CreateCategoryBody,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } =
      await this.categoriesService.createCategory(createCategoryBody);

    return new BaseResponse({ id, message: "Category created" });
  }

  @Patch(":id")
  @Validate({
    response: baseResponse(categorySchema),
    request: [
      { type: "param", name: "id", schema: Type.String() },
      { type: "body", schema: updateCategorySchema },
    ],
  })
  async updateCategory(
    @Query("id") id: string,
    @Body() updateCategoryBody: UpdateCategoryBody,
    @CurrentUser() currentUser: { role: string },
  ): Promise<BaseResponse<CategorySchema>> {
    if (currentUser.role !== "admin") {
      throw new UnauthorizedException(
        "You don't have permission to update category",
      );
    }

    const category = await this.categoriesService.updateCategory(
      id,
      updateCategoryBody,
    );

    return new BaseResponse(category);
  }
}
