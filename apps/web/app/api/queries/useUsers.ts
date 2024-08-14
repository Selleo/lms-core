import { useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";

export function useUsers(page: number, perPage: number) {
  return useSuspenseQuery({
    queryKey: ["users", page, perPage],
    queryFn: async () => {
      const response = await ApiClient.users.usersControllerGetUsers({
        page,
        perPage,
      });
      return response.data;
    },
    staleTime: 5000,
    select: (data) => data,
  });
}
