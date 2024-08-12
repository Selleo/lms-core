import { queryOptions, useQuery } from "@tanstack/react-query";

export const useLessonItem = (id: string) =>
  queryOptions({
    queryKey: ["lesson-items", id],
    queryFn: async () => {
      const response = await fetch(`/api/lesson-items/${id}`);
      return response.json() as Promise<any>;
    },
  });

export function usePokemon(id: string) {
  return useQuery(useLessonItem(id));
}
