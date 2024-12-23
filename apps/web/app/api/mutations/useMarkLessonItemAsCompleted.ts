import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";

export const useMarkLessonItemAsCompleted = () => {
  return useMutation({
    mutationFn: async ({
      id,
      lessonId,
      courseId,
    }: {
      id: string;
      lessonId: string;
      courseId: string;
    }) => {
      const response =
        await ApiClient.api.studentCompletedLessonItemsControllerMarkLessonItemAsCompleted({
          id,
          lessonId,
          courseId,
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
