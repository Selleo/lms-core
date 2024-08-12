import { asc, desc } from "drizzle-orm";

type TProps = {
  page: number;
  pageSize: number;
  queryDB: any;
};

type PageAndPageSize = {
  limit: number;
  offset: number;
};

export const DEFAULT_PAGINATION_LIMIT = 20;

export const getPageAndPageSize = ({ limit, offset }: PageAndPageSize) => ({
  pageSize: +limit,
  page: Math.floor(offset / limit) + 1,
});

export const addPagination = async ({
  queryDB,
  page,
  pageSize,
}: TProps): Promise<{ id: string; title: string }[]> =>
  queryDB.limit(pageSize).offset((page - 1) * pageSize);

export const getSortOptions = (sort: string) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, ""),
});
