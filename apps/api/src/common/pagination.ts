import { AllCategoriesResponse } from "src/categories/schemas/category.schema";

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
