import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiClient } from "../api-client";
import { useToast } from "~/components/ui/use-toast";
import type { ForgotPasswordBody } from "../generated-api";

type LoginUserOptions = {
  data: ForgotPasswordBody;
};

export function usePasswordRecovery() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: LoginUserOptions) => {
      const response = await ApiClient.api.authControllerForgotPassword(
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
