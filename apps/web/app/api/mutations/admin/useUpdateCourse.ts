import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { UpdateCourseBody } from "../../generated-api";
import { useTranslation } from "react-i18next";

type UpdateCourseOptions = {
  data: UpdateCourseBody;
  courseId: string;
};

export function useUpdateCourse() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateCourseOptions) => {
      const response = await ApiClient.api.courseControllerUpdateCourse(
        options.courseId,
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: t('adminCourseView.toast.courseUpdatedSuccessfully') });
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
