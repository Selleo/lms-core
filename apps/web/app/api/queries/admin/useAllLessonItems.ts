import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../../api-client";
import type { GetAllLessonItemsResponse } from "../../generated-api";

type LessonItemType = "text_block" | "question" | "file";

interface LessonItemsQueryParams {
  type?: LessonItemType;
}

export const allLessonItemsQueryOptions = (
  searchParams?: LessonItemsQueryParams
) =>
  queryOptions({
    queryKey: ["lesson-items", "admin", searchParams?.type],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetAllLessonItems({
        ...(searchParams?.type && { type: searchParams.type }),
      });
      return response.data;
    },
    select: (data: GetAllLessonItemsResponse) => data.data,
  });

export function useAllLessonItems(searchParams?: LessonItemsQueryParams) {
  return useQuery(allLessonItemsQueryOptions(searchParams));
}

export function useAllLessonItemsSuspense(
  searchParams?: LessonItemsQueryParams
) {
  return useSuspenseQuery(allLessonItemsQueryOptions(searchParams));
}
