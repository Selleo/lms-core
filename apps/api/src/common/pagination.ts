type TProps = {
  page: number;
  perPage: number;
  queryDB: any;
};

export const DEFAULT_PAGE_SIZE = 20;

export const addPagination = <T>({ queryDB, page, perPage }: TProps): T =>
  queryDB.limit(perPage).offset((page - 1) * perPage);
