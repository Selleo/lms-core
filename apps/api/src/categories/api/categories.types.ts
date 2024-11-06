import {
  type CategoryFilterSchema,
  type SortCategoryFieldsOptions,
} from "../schemas/categoryQuery";

export type CategoriesQuery = {
  filters?: CategoryFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortCategoryFieldsOptions;
};
