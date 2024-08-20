import { SortCategoryQueryOptions } from "../schemas/category-query";

export type CategoriesQuery = {
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: SortCategoryQueryOptions;
};
