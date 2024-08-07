import { CategorieController } from "./api/categories.controller";
import { CategorieService } from "./categories.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [CategorieController],
  providers: [CategorieService],
  exports: [],
})
export class CategoriesModule {}
