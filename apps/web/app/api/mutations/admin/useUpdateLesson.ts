import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { UpdateLessonBody } from "../../generated-api";

type UpdateLessonOptions = {
  data: UpdateLessonBody;
  lessonId: string;
};

export function useUpdateLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateLessonOptions) => {
      const response = await ApiClient.api.lessonsControllerUpdateLesson(options.data, {
        id: options.lessonId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
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
