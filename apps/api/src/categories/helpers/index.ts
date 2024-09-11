import { asc, desc } from "drizzle-orm";
import {
  CategorySortField,
  SortCategoryFieldsOptions,
} from "../schemas/categoryQuery";

export const getSortOptions = (sort: SortCategoryFieldsOptions) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, "") as CategorySortField,
});
