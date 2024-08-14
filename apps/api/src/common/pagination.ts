import { asc, desc } from "drizzle-orm";

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

export const getSortOptions = (sort: string) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, ""),
});
