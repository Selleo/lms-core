import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaCreateChapterBody } from "~/api/generated-api";

type CreateChapterOptions = {
  data: BetaCreateChapterBody;
};

export function useBetaCreateChapter() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateChapterOptions) => {
      const response = await ApiClient.api.chapterControllerBetaCreateChapter(options.data);

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
