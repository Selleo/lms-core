import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { useCurrentUserSuspense } from "../queries/useCurrentUser";

import type { ChangePasswordBody } from "../generated-api";

type ChangePasswordOptions = {
  data: ChangePasswordBody;
};

export function useChangePassword() {
  const { data: currentUser } = useCurrentUserSuspense();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ChangePasswordOptions) => {
      const response = await ApiClient.api.userControllerChangePassword(
        { id: currentUser.id },
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Password updated successfully",
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
