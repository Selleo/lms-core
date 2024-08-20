import { asc, desc } from "drizzle-orm";
import {
  CategorySortQuery,
  SortCategoryQuery,
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
}: TProps): Promise<{ id: string; title: string }[]> =>
  queryDB.limit(perPage).offset((page - 1) * perPage);

export const getSortOptions = (sort: SortCategoryQuery) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, "") as CategorySortQuery,
});
