import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiClient } from "../api-client";
import { ChangePasswordBody } from "../generated-api";
import { useCurrentUserSuspense } from "../queries/useCurrentUser";
import { useToast } from "~/components/ui/use-toast";

type ChangePasswordOptions = {
  data: ChangePasswordBody;
};

export function useChangePassword() {
  const { data: currentUser } = useCurrentUserSuspense();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ChangePasswordOptions) => {
      const response = await ApiClient.api.usersControllerChangePassword(
        currentUser.id,
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
