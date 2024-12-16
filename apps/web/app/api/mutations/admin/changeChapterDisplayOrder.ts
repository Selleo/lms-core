import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

type ChangeChapterDisplayOrderOptions = {
  chapter: { chapterId: string; displayOrder: number };
};

export function useChangeChapterDisplayOrder() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ChangeChapterDisplayOrderOptions) => {
      const response = await ApiClient.api.chapterControllerUpdateChapterDisplayOrder(
        options.chapter,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Chapter display order updated successfully" });
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
