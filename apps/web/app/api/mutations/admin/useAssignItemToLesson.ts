import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { AssignItemsToLessonBody } from "../../generated-api";

type AssignItemToLessonOptions = {
  data: AssignItemsToLessonBody;
  lessonId: string;
};

export function useAssignItemToLesson() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: AssignItemToLessonOptions) => {
      const response = await ApiClient.api.lessonsControllerAssignItemsToLesson(
        options.lessonId,
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Successfully assigned items to lesson" });
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
