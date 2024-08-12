import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
// TODO Connect to the database when the backend is completed
export async function deleteLessonItem(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: _id };
}
export async function invalidateLessonItemQueries(
  queryClient: QueryClient,
  id?: string
) {
  await queryClient.invalidateQueries("lessonItems");

  if (id) {
    await queryClient.invalidateQueries(["lessonItem", id]);
  }
}

// Hook do usuwania elementu lekcji
export function useDeleteLessonItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteLessonItem"],
    mutationFn: ({ id }: { id: string }) => deleteLessonItem(id),
    onSettled: (_data, _error, variables) => {
      invalidateLessonItemQueries(queryClient, variables.id);
    },
  });
}
