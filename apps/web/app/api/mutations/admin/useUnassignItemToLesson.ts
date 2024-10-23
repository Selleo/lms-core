import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { UnassignItemsFromLessonBody } from "../../generated-api";

type UnassignItemToLessonOptions = {
  data: UnassignItemsFromLessonBody;
  lessonId: string;
};

export function useUnassignItemToLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UnassignItemToLessonOptions) => {
      const response =
        await ApiClient.api.lessonsControllerUnassignItemsFromLesson(
          options.lessonId,
          options.data
        );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Successfully unassigned items from lesson" });
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
