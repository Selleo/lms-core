import { asc, desc } from "drizzle-orm";

type DrizzleQuery = {
  limit: (limit: number) => any;
  offset: (offset: number) => any;
};

type PaginationProps<T extends DrizzleQuery> = {
  queryDB: T;
  page: number;
  perPage: number;
};

export const DEFAULT_PAGE_SIZE = 20;

export const addPagination = <T extends DrizzleQuery>({
  queryDB,
  page,
  perPage,
}: PaginationProps<T>): T => {
  return queryDB.limit(perPage).offset((page - 1) * perPage) as T;
};

export const getSortOptions = (sort: string) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, ""),
});
