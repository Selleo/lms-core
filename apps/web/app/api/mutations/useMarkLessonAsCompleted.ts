import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";

export const useMarkLessonAsCompleted = () => {
  return useMutation({
    mutationFn: async ({ lessonId }: { lessonId: string }) => {
      const response = await ApiClient.api.studentLessonProgressControllerMarkLessonAsCompleted({
        id: lessonId,
      });

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
