import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

type ChangeLessonDisplayOrderOptions = {
  lesson: { lessonId: string; displayOrder: number };
};

export function useChangeLessonDisplayOrder() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ChangeLessonDisplayOrderOptions) => {
      const response = await ApiClient.api.lessonControllerUpdateLessonDisplayOrder(options.lesson);

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Lesson display order updated successfully" });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          description: error.response?.data.message || "An error occurred while updating.",
          variant: "destructive",
        });
      }
      toast({
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
