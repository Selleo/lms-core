import { useEffect, type ReactNode } from "react";
import { match } from "ts-pattern";

import { useThemeStore } from "./themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    match(theme)
      .with("dark", () => {
        document.documentElement.classList.add("dark");
      })
      .with("light", () => {
        document.documentElement.classList.remove("dark");
      })
      .exhaustive();
  }, [theme]);

  return <>{children}</>;
}
