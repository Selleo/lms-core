import { Module } from "@nestjs/common";

import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [],
})
export class CategoryModule {}
