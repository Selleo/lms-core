import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }

        if (failureCount >= 3) return false;

        return true;
      },
    },
  },
});
