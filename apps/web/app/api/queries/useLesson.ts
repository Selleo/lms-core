import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetLessonByIdResponse } from "../generated-api";

export const lessonQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const response = await ApiClient.api.lessonControllerGetLessonById(id);
      return response.data;
    },
    select: (data: GetLessonByIdResponse) => data.data,
  });

export function useLesson(id: string) {
  return useQuery(lessonQueryOptions(id));
}

export function useLessonSuspense(id: string) {
  return useSuspenseQuery(lessonQueryOptions(id));
}
