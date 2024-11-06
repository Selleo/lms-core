import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { CreateLessonBody } from "../../generated-api";

type CreateLessonOptions = {
  data: CreateLessonBody;
};

export function useCreateLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateLessonOptions) => {
      const response = await ApiClient.api.lessonsControllerCreateLesson(options.data);

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Lesson created successfully",
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
