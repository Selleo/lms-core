import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetCourseByIdResponse } from "../../generated-api";

export const courseQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["course", "admin", { id }],
    queryFn: async () => {
      const response = await ApiClient.api.coursesControllerGetCourseById({
        id,
      });
      return response.data;
    },
    select: (data: GetCourseByIdResponse) => data.data,
  });

export function useCourseById(id: string) {
  return useQuery(courseQueryOptions(id));
}

export function useCourseByIdSuspense(id: string) {
  return useSuspenseQuery(courseQueryOptions(id));
}
