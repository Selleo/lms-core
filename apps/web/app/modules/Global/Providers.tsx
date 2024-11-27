import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../../api/queryClient";
import { ThemeProvider } from "../Theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
