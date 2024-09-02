import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiClient } from "../api-client";
import { useToast } from "~/components/ui/use-toast";
import type { CreatePasswordBody, ResetPasswordBody } from "../generated-api";

type CreateNewPasswordOptions = {
  data: ResetPasswordBody | CreatePasswordBody;
};

type useCreateNewPasswordProps = {
  isCreate?: boolean;
};

export function useCreateNewPassword({
  isCreate = true,
}: useCreateNewPasswordProps) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateNewPasswordOptions) => {
      if (isCreate) {
        const response = await ApiClient.api.authControllerCreatePassword(
          options.data as CreatePasswordBody,
        );

        return response.data;
      }

      const response = await ApiClient.api.authControllerResetPassword(
        options.data as ResetPasswordBody,
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
