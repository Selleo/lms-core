import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetQuestionAnswersResponse } from "../../generated-api";

export const questionOptions = (id: string) =>
  queryOptions({
    queryKey: ["question-options", "admin", { id }],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetQuestionAnswers({
        questionId: id,
      });

      return response.data;
    },
    select: (data: GetQuestionAnswersResponse) => data.data,
  });

export function useQuestionOptions(id: string) {
  return useQuery(questionOptions(id));
}

export function useQuestionOptionsSuspense(id: string) {
  return useSuspenseQuery(questionOptions(id));
}
