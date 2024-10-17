import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { GetAllCategoriesResponse } from "../generated-api";

export const categoriesQueryOptions = {
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await ApiClient.api.categoriesControllerGetAllCategories();
    return response.data;
  },
  select: (data: GetAllCategoriesResponse) => data.data,
};

export function useCategories() {
  return useQuery(categoriesQueryOptions);
}

export function useCategoriesSuspense() {
  return useSuspenseQuery(categoriesQueryOptions);
}
