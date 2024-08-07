import { Controller, Get, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import { BaseResponse, baseResponse } from "src/common";
import { CategorieService } from "../categories.service";
import { TCategoriesQuery } from "./types";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    response: baseResponse(allCategoriesSchema),
  })
  async getAllCategories(
    @Query() query: TCategoriesQuery,
  ): Promise<BaseResponse<AllCategoriesResponse>> {
    const categories = await this.categoriesService.getCategories(query);

    return new BaseResponse(categories);
  }
}
