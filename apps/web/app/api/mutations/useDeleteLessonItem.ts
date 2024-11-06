import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

//TODO: Connect to the database when the backend is completed
export async function deleteLessonItem(_id: string) {
  //TODO: Implement the actual API call to delete the lesson item once the backend is available
  return { id: _id };
}

export function useDeleteLessonItem() {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["delete-lesson-item"],
    mutationFn: ({ id }: { id: string }) => deleteLessonItem(id),
    onSuccess: () => {
      toast({ description: "Lesson item deleted successfully." });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
