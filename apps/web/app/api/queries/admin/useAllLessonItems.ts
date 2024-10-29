import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../../api-client";
import type { GetAllLessonItemsResponse } from "../../generated-api";

export type LessonItemType = "text_block" | "question" | "file";

type LessonItemsQueryParams = {
  type?: LessonItemType;
  title?: string;
  state?: string;
  archived?: boolean;
  sort?: string;
  page?: number;
  perPage?: number;
};

export const ALL_LESSON_ITEMS_QUERY_KEY = ["lesson-items", "admin"];

export const allLessonItemsQueryOptions = (
  searchParams?: LessonItemsQueryParams
) =>
  queryOptions({
    queryKey: [...ALL_LESSON_ITEMS_QUERY_KEY, searchParams],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetAllLessonItems({
        page: 1,
        perPage: 100,
        ...(searchParams?.type && { type: searchParams.type }),
        ...(searchParams?.title && { title: searchParams.title }),
        ...(searchParams?.state && { state: searchParams.state }),
        ...(searchParams?.archived !== undefined && {
          archived: String(searchParams.archived),
        }),
        ...(searchParams?.sort && { sort: searchParams.sort }),
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
