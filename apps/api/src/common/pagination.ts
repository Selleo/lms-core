import { asc, desc } from "drizzle-orm";

import { AllCategoriesResponse } from "src/categories/schemas/category.schema";
import {
  CategorySortQuery,
  SortCategoryQueryOptions,
} from "src/categories/schemas/category-query";

type TProps = {
  page: number;
  perPage: number;
  queryDB: any;
};

export const DEFAULT_PAGE_SIZE = 20;

export const addPagination = async ({
  queryDB,
  page,
  perPage,
}: TProps): Promise<AllCategoriesResponse> =>
  queryDB.limit(perPage).offset((page - 1) * perPage);

export const getSortOptions = (sort: SortCategoryQueryOptions) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, "") as CategorySortQuery,
});
