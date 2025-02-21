import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";

import i18n from "../../../i18n";
import { queryClient } from "../../api/queryClient";
import { ThemeProvider } from "../Theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
