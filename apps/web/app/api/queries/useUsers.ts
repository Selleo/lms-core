import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetUsersResponse } from "../generated-api";

type UsersParams = {
  keyword?: string;
  role?: string;
  archived?: boolean;
  sort?: string;
};

export const usersQueryOptions = (searchParams?: UsersParams) => ({
  queryKey: ["users", searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.usersControllerGetUsers({
      page: 1,
      perPage: 100,
      ...(searchParams?.keyword && { keyword: searchParams.keyword }),
      ...(searchParams?.role && { role: searchParams.role }),
      ...(searchParams?.archived !== undefined && {
        archived: String(searchParams.archived),
      }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
    });
    return response.data;
  },
  select: (data: GetUsersResponse) => data.data,
});

export function useAllUsers(searchParams?: UsersParams) {
  return useQuery(usersQueryOptions(searchParams));
}

export function useAllUsersSuspense(searchParams?: UsersParams) {
  return useSuspenseQuery(usersQueryOptions(searchParams));
}
