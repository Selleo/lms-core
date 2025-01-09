import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { currentUserQueryOptions, useCurrentUserSuspense } from "../queries/useCurrentUser";
import { queryClient } from "../queryClient";

import type { UpdateUserBody } from "../generated-api";
import { useTranslation } from "react-i18next";

type UpdateUserOptions = {
  data: UpdateUserBody;
};

export function useUpdateUser() {
  const { data: currentUser } = useCurrentUserSuspense();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateUserOptions) => {
      const response = await ApiClient.api.userControllerUpdateUser(
        {
          id: currentUser.id,
        },
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentUserQueryOptions);
      toast({ description: t("changeUserInformationView.toast.userUpdatedSuccessfully") });
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
