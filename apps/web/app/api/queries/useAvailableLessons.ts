import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetAvailableLessonsResponse } from "../generated-api";

export const availableLessons = (courseId: string) =>
  queryOptions({
    queryKey: ["available-lessons", "courseId"],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetAvailableLessons({ courseId });
      return response.data;
    },
    select: (data: GetAvailableLessonsResponse) => data.data,
  });

export function useAvailableLessons(courseId: string) {
  return useQuery(availableLessons(courseId));
}

export function useAvailableLessonsSuspense(courseId: string) {
  return useSuspenseQuery(availableLessons(courseId));
}
