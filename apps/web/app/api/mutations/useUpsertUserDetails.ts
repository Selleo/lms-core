import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { currentUserQueryOptions } from "../queries/useCurrentUser";
import { queryClient } from "../queryClient";

import type { UpsertUserDetailsBody } from "../generated-api";

type UpdateUserDetailsOptions = {
  data: UpsertUserDetailsBody;
};

export function useUpsertUserDetails() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateUserDetailsOptions) => {
      const response = await ApiClient.api.userControllerUpsertUserDetails(options.data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentUserQueryOptions);
      toast({ description: "User details updated successfully" });
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
