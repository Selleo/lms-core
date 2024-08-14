import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { CurrentUserResponse } from "../generated-api";

export const currentUserQueryOptions = {
  queryKey: ["currentUser"],
  queryFn: async () => {
    const response = await ApiClient.auth.authControllerCurrentUser();
    return response.data;
  },
  select: (data: CurrentUserResponse) => data.data,
};

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions);
}

export function useCurrentUserSuspense() {
  return useSuspenseQuery(currentUserQueryOptions);
}
//TODO:  