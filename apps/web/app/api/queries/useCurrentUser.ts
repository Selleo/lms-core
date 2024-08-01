import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";

export const currentUserQueryOptions = {
  queryKey: ["currentUser"],
  queryFn: async () => {
    const response = await ApiClient.auth.authControllerCurrentUser();
    return response.data;
  },
};

export function useCurrentUser() {
  const { data, ...rest } = useQuery(currentUserQueryOptions);
  return { data: data?.data, ...rest };
}

export function useCurrentUserSuspense() {
  const { data, ...rest } = useSuspenseQuery(currentUserQueryOptions);
  return { data: data.data, ...rest };
}
