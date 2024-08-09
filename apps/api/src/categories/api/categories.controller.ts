import { Controller, Get, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import { BaseResponse, baseResponse, QueryParamsSchema } from "src/common";
import { CategorieService } from "../categories.service";
import { CategoriesQuery } from "./types";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    // request: [{ type: "query", name: "categories", schema: QueryParamsSchema }],
    response: baseResponse(allCategoriesSchema),
  })
  async getAllCategories(
    @Query() query: CategoriesQuery,
  ): Promise<BaseResponse<AllCategoriesResponse>> {
    const categories = await this.categoriesService.getCategories(query);

    return new BaseResponse(categories) as any;
  }
}
