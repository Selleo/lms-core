import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

type DeleteChapterOptions = {
  courseId: string;
  chapterId: string;
};

export function useDeleteChapter() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: DeleteChapterOptions) => {
      const response = await ApiClient.api.lessonsControllerRemoveChapter(
        options.courseId,
        options.chapterId,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Course updated successfully" });
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
