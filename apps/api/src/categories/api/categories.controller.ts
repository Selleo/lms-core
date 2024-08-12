import { Controller, Get } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import {
  basePaginatedResponse,
  BasePaginatedResponse,
  BasePagination,
  PaginationValidation,
} from "src/common";
import { CategorieService } from "../categories.service";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    request: PaginationValidation,
    response: basePaginatedResponse(allCategoriesSchema),
  })
  async getAllCategories(
    filter?: string,
    limit?: number,
    offset?: number,
    sort?: string,
  ): Promise<BasePaginatedResponse<AllCategoriesResponse, BasePagination>> {
    const query = { filter, limit, offset, sort };

    const data = await this.categoriesService.getCategories(query);

    return new BasePaginatedResponse(data.categories, data.pagination);
  }
}
