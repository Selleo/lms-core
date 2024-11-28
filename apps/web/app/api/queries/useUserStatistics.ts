import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetUserStatisticsResponse } from "../generated-api";

export const userStatistics = () => {
  return {
    queryKey: ["user-statistics/user-stats"],
    queryFn: async () => {
      const response = await ApiClient.api.statisticsControllerGetUserStatistics();

      return response.data;
    },
    select: (data: GetUserStatisticsResponse) => data.data,
  };
};

export function useUserStatistics() {
  return useQuery(userStatistics());
}

export function useUserStatisticsSuspense() {
  return useSuspenseQuery(userStatistics());
}
