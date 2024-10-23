import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../../api-client";
import type { GetLessonItemByIdResponse } from "../../generated-api";

export const lessonItemByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["lesson-item", "admin", { id }],
    queryFn: async () => {
      const response =
        await ApiClient.api.lessonsControllerGetLessonItemById(id);
      return response.data;
    },
    select: (data: GetLessonItemByIdResponse) => data.data,
  });

export function useLessonItemById(id: string) {
  return useQuery(lessonItemByIdQueryOptions(id));
}

export function useLessonItemByIdSuspense(id: string) {
  return useSuspenseQuery(lessonItemByIdQueryOptions(id));
}
