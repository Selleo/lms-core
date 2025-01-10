import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { DeleteBulkUsersBody } from "../../generated-api";

type DeleteBulkUsers = {
  data: DeleteBulkUsersBody;
};

export function useBulkDeleteUsers() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: DeleteBulkUsers) => {
      const response = await ApiClient.api.userControllerDeleteBulkUsers({
        userIds: options.data.userIds,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Successfully deleted selected users",
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
