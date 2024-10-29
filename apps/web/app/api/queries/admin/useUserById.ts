import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api-client";
import { GetUserByIdResponse } from "../../generated-api";

export const userQueryOptions = (id: string) => ({
  queryKey: ["users", "admin", { id }],
  queryFn: async () => {
    const response = await ApiClient.api.usersControllerGetUserById(id);
    return response.data;
  },
  select: (data: GetUserByIdResponse) => data.data,
});

export function useUserById(id: string) {
  return useQuery(userQueryOptions(id));
}

export function useUserByIdSuspense(id: string) {
  return useSuspenseQuery(userQueryOptions(id));
}
