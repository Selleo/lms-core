import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
// TODO Connect to the database when the backend is completed

export async function updateLessonItem(_id: string) {
  const defaultData = {
    title: "Updated title",
    description: "Updated description",
  };

  return { id: _id, ...defaultData };
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

export function useUpdateLessonItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateLessonItem"],
    mutationFn: ({ id }: { id: string }) => updateLessonItem(id),
    onSettled: (_data, _error, variables) => {
      invalidateLessonItemQueries(queryClient, variables.id);
    },
  });
}
