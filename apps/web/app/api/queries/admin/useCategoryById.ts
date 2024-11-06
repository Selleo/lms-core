import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetCategoryByIdResponse } from "../../generated-api";

export const categoryByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["category", "admin", { id }],
    queryFn: async () => {
      const response = await ApiClient.api.categoriesControllerGetCategoryById(id);
      return response.data;
    },
    select: (data: GetCategoryByIdResponse) => data.data,
  });

export function useCategoryById(id: string) {
  return useQuery(categoryByIdQueryOptions(id));
}

export function useCategoryByIdSuspense(id: string) {
  return useSuspenseQuery(categoryByIdQueryOptions(id));
}
