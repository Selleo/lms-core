import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { GetUsersResponse } from "../generated-api";

export const usersQueryOptions = {
  queryKey: ["users"],
  queryFn: async () => {
    const response = await ApiClient.users.usersControllerGetUsers();
    return response.data;
  },
  select: (data: GetUsersResponse) => data.data,
};

export function useAllUsers() {
  return useQuery(usersQueryOptions);
}

export function useAllUsersSuspense() {
  return useSuspenseQuery(usersQueryOptions);
}
