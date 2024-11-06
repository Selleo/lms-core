import { vi } from "vitest";

import type { PropsWithChildren } from "react";

export const mockedUseNavigate = vi.fn();

export function mockRemixReact() {
  return vi.mock("@remix-run/react", async (importOriginal) => {
    const original = await importOriginal<typeof import("@remix-run/react")>();
    return {
      ...original,
      useNavigate: () => mockedUseNavigate,
      Link: ({ to, children }: PropsWithChildren<{ to: string }>) => <a href={to}>{children}</a>,
    };
  });
}
