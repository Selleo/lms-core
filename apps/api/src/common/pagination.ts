import type { PgSelect } from "drizzle-orm/pg-core";

export const DEFAULT_PAGE_SIZE = 20;

export function addPagination<T extends PgSelect>(
  queryDB: T,
  page: number = 1,
  perPage: number = DEFAULT_PAGE_SIZE,
) {
  return queryDB.limit(perPage).offset((page - 1) * perPage);
}
