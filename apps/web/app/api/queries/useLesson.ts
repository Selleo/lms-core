import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetLessonResponse } from "../generated-api";

export const lessonQueryOptions = (id?: string) =>
  queryOptions({
    enabled: !!id,
    queryKey: ["lesson", id],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetLesson({
        id,
      });
      return response.data;
    },
    select: (data: GetLessonResponse) => data.data,
  });

export function useLesson(id?: string) {
  return useQuery(lessonQueryOptions(id));
}

export function useLessonSuspense(id?: string) {
  return useSuspenseQuery(lessonQueryOptions(id));
}
