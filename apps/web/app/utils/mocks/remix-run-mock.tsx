import { PropsWithChildren } from "react";
import { vi } from "vitest";

export const mockedUseNavigate = vi.fn();

export function mockRemixReact() {
  return vi.mock("@remix-run/react", async (importOriginal) => {
    const original = await importOriginal<typeof import("@remix-run/react")>();
    return {
      ...original,
      useNavigate: () => mockedUseNavigate,
      Link: ({ to, children }: PropsWithChildren<{ to: string }>) => (
        <a href={to}>{children}</a>
      ),
    };
  });
}
