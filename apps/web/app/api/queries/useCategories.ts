import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { GetAllCategoriesResponse } from "../generated-api";

type CategorySearchParams = {
  title?: string;
  archived?: boolean;
};

export const CATEGORIES_QUERY_KEY = ["categories"];

export const categoriesQueryOptions = (
  searchParams?: CategorySearchParams
) => ({
  queryKey: [...CATEGORIES_QUERY_KEY, searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.categoriesControllerGetAllCategories({
      page: 1,
      perPage: 100,
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.archived !== undefined && {
        archived: String(searchParams.archived),
      }),
    });
    return response.data;
  },
  select: (data: GetAllCategoriesResponse) => data.data,
});

export function useCategories(searchParams?: CategorySearchParams) {
  return useQuery(categoriesQueryOptions(searchParams));
}

export function useCategoriesSuspense(searchParams?: CategorySearchParams) {
  return useSuspenseQuery(categoriesQueryOptions(searchParams));
}
