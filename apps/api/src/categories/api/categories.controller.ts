import { Controller, Get } from "@nestjs/common";
import { Validate } from "nestjs-typebox";

import {
  AllCategoriesResponse,
  allCategoriesSchema,
} from "../schemas/categoty.schema";
import { BaseResponse, baseResponse } from "src/common";
import { CategorieService } from "../categories.service";

@Controller("categories")
export class CategorieController {
  constructor(private readonly categoriesService: CategorieService) {}

  @Get()
  @Validate({
    response: baseResponse(allCategoriesSchema),
  })
  async getAllCategories(): Promise<BaseResponse<AllCategoriesResponse>> {
    const categories = await this.categoriesService.getCategories();

    return new BaseResponse(categories);
  }
}
