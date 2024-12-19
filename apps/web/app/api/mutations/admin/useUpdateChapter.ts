import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { UpdateChapterBody } from "../../generated-api";

type UpdateChapterOptions = {
  chapterId: string;
  data: UpdateChapterBody;
};

export function useUpdateChapter() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateChapterOptions) => {
      const response = await ApiClient.api.chapterControllerUpdateChapter(options.data, {
        id: options.chapterId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Chapter updated successfully" });
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
