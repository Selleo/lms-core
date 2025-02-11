import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetBetaCourseByIdResponse } from "../../generated-api";

export const COURSE_QUERY_KEY = ["beta-course", "admin"];

export const courseQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [COURSE_QUERY_KEY, { id }],
    queryFn: async () => {
      const response = await ApiClient.api.courseControllerGetBetaCourseById({
        id,
      });
      return response.data;
    },
    select: (data: GetBetaCourseByIdResponse) => data.data,
  });

export function useBetaCourseById(id: string) {
  return useQuery(courseQueryOptions(id));
}

export function useBetaCourseByIdSuspense(id: string) {
  return useSuspenseQuery(courseQueryOptions(id));
}
