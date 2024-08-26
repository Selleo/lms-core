import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiClient } from "../api-client";
import { useToast } from "~/components/ui/use-toast";
import { ResetPasswordBody } from "../generated-api";

type CreateNewPasswordOptions = {
  data: ResetPasswordBody;
};

export function useCreateNewPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateNewPasswordOptions) => {
      const response = await ApiClient.api.authControllerResetPassword(
        options.data,
      );

      return response.data;
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
