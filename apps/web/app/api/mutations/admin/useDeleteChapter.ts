import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

type DeleteChapterOptions = {
  chapterId: string;
};

export function useDeleteChapter() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: DeleteChapterOptions) => {
      const response = await ApiClient.api.chapterControllerRemoveChapter({
        chapterId: options.chapterId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({ description: t("adminCourseView.toast.courseUpdatedSuccessfully") });
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
