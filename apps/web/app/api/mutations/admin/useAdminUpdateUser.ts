import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { usersQueryOptions } from "../../queries/useUsers";
import { queryClient } from "../../queryClient";

import type { UpdateUserBody } from "../../generated-api";

type UpdateUserOptions = {
  data: UpdateUserBody;
  userId: string;
};

export function useAdminUpdateUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateUserOptions) => {
      const response = await ApiClient.api.usersControllerAdminUpdateUser(
        { id: options.userId },
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(usersQueryOptions());
      toast({ description: "User updated successfully" });
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
