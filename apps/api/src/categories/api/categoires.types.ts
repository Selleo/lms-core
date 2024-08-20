import { SortCategoryQuery } from "../schemas/category-query";

export type CategoriesQuery = {
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: SortCategoryQuery;
};
