import type { CategoryFilterSchema, SortCategoryFieldsOptions } from "./categoryQuery";

export type CategoryQuery = {
  filters?: CategoryFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortCategoryFieldsOptions;
};
