import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetTeacherStatsResponse } from "../generated-api";

export const userStatistics = () => {
  return {
    queryKey: ["statistics/teacher-stats"],
    queryFn: async () => {
      const response = await ApiClient.api.statisticsControllerGetTeacherStats();

      return response.data;
    },
    select: (data: GetTeacherStatsResponse) => data.data,
  };
};

export function useTeacherStatistics() {
  return useQuery(userStatistics());
}

export function useTeacherStatisticsSuspense() {
  return useSuspenseQuery(userStatistics());
}
