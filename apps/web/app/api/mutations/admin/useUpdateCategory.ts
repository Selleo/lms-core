import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { UpdateCategoryBody } from "../../generated-api";
import { useTranslation } from "react-i18next";

type UpdateCategoryOptions = {
  data: UpdateCategoryBody;
  categoryId: string;
};

export function useUpdateCategory() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateCategoryOptions) => {
      const response = await ApiClient.api.categoryControllerUpdateCategory(
        options.categoryId,
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: t("adminCategoryView.toast.categoryUpdatedSuccessfully") });
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
