import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaCreateQuizLessonBody } from "~/api/generated-api";

type CreateQuizLessonOptions = {
  data: BetaCreateQuizLessonBody;
};

export function useCreateQuizLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateQuizLessonOptions) => {
      const response = await ApiClient.api.lessonControllerBetaCreateQuizLesson(options.data);

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Text block created successfully",
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
