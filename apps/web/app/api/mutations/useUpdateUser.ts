import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiClient } from "../api-client";
import { UpdateUserBody } from "../generated-api";
import { queryClient } from "../queryClient";
import {
  currentUserQueryOptions,
  useCurrentUserSuspense,
} from "../queries/useCurrentUser";

type UpdateUserOptions = {
  data: UpdateUserBody;
};

export function useUpdateUser() {
  const { data: currentUser } = useCurrentUserSuspense();

  return useMutation({
    mutationFn: async (options: UpdateUserOptions) => {
      const response = await ApiClient.users.usersControllerUpdateUser(
        currentUser.id,
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentUserQueryOptions);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error(error.message);
    },
  });
}
