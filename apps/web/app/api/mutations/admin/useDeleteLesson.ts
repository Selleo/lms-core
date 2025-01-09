import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { useTranslation } from "react-i18next";

type DeleteLessonOptions = {
  chapterId: string;
  lessonId: string;
};

export function useDeleteLesson() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: DeleteLessonOptions) => {
      const response = await ApiClient.api.lessonControllerRemoveLesson({
        lessonId: options.lessonId,
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
