import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { queryClient } from "../../api/queryClient";
import { ThemeProvider } from "../Theme/ThemeProvider";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then(({ ReactQueryDevtools }) => ({
    default: ReactQueryDevtools,
  })),
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  /*
   * awful hack but this is the only way (I found) to make react-query devtools work in our remix
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}

        {mounted && process.env.NODE_ENV === "development" && (
          <>
            {createPortal(
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
              </Suspense>,
              document.body,
            )}
          </>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
