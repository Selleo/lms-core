import { QueryClient } from "@tanstack/react-query";
import { isAxiosError, isCancel } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error: unknown) {
        if (isCancel(error)) return false;

        if (isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }

        if (failureCount >= 3) return false;

        return true;
      },
      throwOnError: (error) => !isCancel(error),
    },
    mutations: {
      retry(failureCount, error: unknown) {
        if (isCancel(error)) return false;

        if (isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }

        if (failureCount >= 3) return false;

        return true;
      },
      throwOnError: (error) => !isCancel(error),
    },
  },
});
