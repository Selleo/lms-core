import { SortCategoryFieldsOptions } from "../schemas/categoryQuery";

export type CategoriesQuery = {
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: SortCategoryFieldsOptions;
};
