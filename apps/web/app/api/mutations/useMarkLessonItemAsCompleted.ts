import { toast } from "~/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiClient } from "../api-client";

export const useMarkLessonItemAsCompleted = () => {
  return useMutation({
    mutationFn: async ({ id, lessonId }: { id: string; lessonId: string }) => {
      const response =
        await ApiClient.api.studentCompletedLessonItemsControllerMarkLessonItemAsCompleted(
          { id, lessonId }
        );

      return response.data;
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
};
