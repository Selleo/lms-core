import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../Theme/ThemeProvider";
import { queryClient } from "../../api/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
