import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";

export const usersQueryOptions = {
  queryKey: ["users"],
  queryFn: async () => {
    const response = await ApiClient.users.usersControllerGetUsers();
    return response.data;
  },
};

export function useAllUsers() {
  const { data, ...rest } = useQuery(usersQueryOptions);
  return { data: data?.data, ...rest };
}

export function useAllUsersSuspense() {
  const { data, ...rest } = useSuspenseQuery(usersQueryOptions);
  return { data: data.data, ...rest };
}
