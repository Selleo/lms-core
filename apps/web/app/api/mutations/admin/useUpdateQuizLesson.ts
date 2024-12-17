import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { BetaUpdateQuizLessonBody } from "~/api/generated-api";

type UpdateLessonOptions = {
  data: BetaUpdateQuizLessonBody;
  lessonId: string;
};

export function useUpdateQuizLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateLessonOptions) => {
      const response = await ApiClient.api.lessonControllerBetaUpdateQuizLesson(options.data, {
        id: options.lessonId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Lesson updated successfully",
        description: "Lesson updated successfully",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          variant: "destructive",
          description: error.response?.data.message,
        });
      }
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
}
