import { CategoriesController } from "./api/categories.controller";
import { CategoriesService } from "./categories.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [],
})
export class CategoriesModule {}
