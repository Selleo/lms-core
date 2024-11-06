import { Module } from "@nestjs/common";

import { CategoriesController } from "./api/categories.controller";
import { CategoriesService } from "./categories.service";

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [],
})
export class CategoriesModule {}
