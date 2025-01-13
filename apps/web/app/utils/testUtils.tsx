import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import i18next from "./mocks/i18next.mock";

import type { ReactElement } from "react";
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

const I18nProvider = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
);

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

  withI18n() {
    this.providers.push(I18nProvider);
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

  renderer.withI18n();

  return renderer;
};
