import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetLessonResponse } from "../generated-api";

export const lessonQueryOptions = (id: string, courseId: string) =>
  queryOptions({
    queryKey: ["lesson", id, courseId],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetLesson({
        id,
        courseId,
      });
      return response.data;
    },
    select: (data: GetLessonResponse) => data.data,
  });

export function useLesson(id: string, courseId: string) {
  return useQuery(lessonQueryOptions(id, courseId));
}

export function useLessonSuspense(id: string, courseId: string) {
  return useSuspenseQuery(lessonQueryOptions(id, courseId));
}
