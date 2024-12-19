import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiClient } from "~/api/api-client";
import { currentUserQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import { useToast } from "~/components/ui/use-toast";

import type { CreateUserBody } from "~/api/generated-api";

type CreateUserOptions = {
  data: CreateUserBody;
};

export function useCreateUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateUserOptions) => {
      const response = await ApiClient.api.userControllerCreateUser(options.data);

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
