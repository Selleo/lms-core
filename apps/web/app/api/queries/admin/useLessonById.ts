import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../../api-client";
import { GetLessonByIdResponse } from "../../generated-api";

export const lessonByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["lesson", "admin", { id }],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetLessonById(id);
      return response.data;
    },
    select: (data: GetLessonByIdResponse) => data.data,
  });

export function useLessonById(id: string) {
  return useQuery(lessonByIdQueryOptions(id));
}

export function useLessonByIdSuspense(id: string) {
  return useSuspenseQuery(lessonByIdQueryOptions(id));
}
