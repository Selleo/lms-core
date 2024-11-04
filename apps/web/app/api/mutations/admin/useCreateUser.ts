import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { CreateUserBody } from "~/api/generated-api";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "~/api/api-client";
import { queryClient } from "~/api/queryClient";
import { currentUserQueryOptions } from "~/api/queries";

type CreateUserOptions = {
  data: CreateUserBody;
};

export function useCreateUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateUserOptions) => {
      const response = await ApiClient.api.usersControllerCreateUser(
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentUserQueryOptions);
      toast({ description: "User created successfully" });
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
