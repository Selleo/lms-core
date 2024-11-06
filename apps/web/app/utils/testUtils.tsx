import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

import type React from "react";

const MockThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

interface RenderWithOptions {
  withTheme?: boolean;
  withQuery?: boolean;
}

class TestRenderer {
  private providers: React.FC<{ children: React.ReactNode }>[] = [];

  withTheme() {
    this.providers.push(MockThemeProvider);
    return this;
  }

  withQuery() {
    this.providers.push(QueryProvider);
    return this;
  }

  render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
    const AllProviders = ({ children }: { children: React.ReactNode }) => (
      <>
        {this.providers.reduceRight(
          (acc, Provider) => (
            <Provider>{acc}</Provider>
          ),
          children,
        )}
      </>
    );

    return render(ui, { wrapper: AllProviders, ...options });
  }
}

export const renderWith = (options: RenderWithOptions = {}) => {
  const renderer = new TestRenderer();

  if (options.withTheme) {
    renderer.withTheme();
  }

  if (options.withQuery) {
    renderer.withQuery();
  }

  return renderer;
};
