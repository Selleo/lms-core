import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetUserDetailsResponse } from "../generated-api";

export const userDetails = (userId: string) => {
  return {
    queryKey: ["user-details", userId],
    queryFn: async () => {
      const response = await ApiClient.api.usersControllerGetUserDetails({ userId });

      return response.data;
    },
    select: (data: GetUserDetailsResponse) => data.data,
  };
};

export function useUserDetails(userId: string) {
  return useQuery(userDetails(userId));
}

export function useUserDetailsSuspense(userId: string) {
  return useSuspenseQuery(userDetails(userId));
}
