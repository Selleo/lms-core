import { asc, desc } from "drizzle-orm";
import {
  CategorySortField,
  SortCategoryFieldsOptions,
} from "src/categories/schemas/category-query";

export const getSortOptions = (sort: SortCategoryFieldsOptions) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, "") as CategorySortField,
});
