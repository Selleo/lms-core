Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: matchingMediaQueries.includes(query),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

let matchingMediaQueries: string[] = [];

export function setMatchingMediaQuery(queries: string | string[]): void {
  matchingMediaQueries = Array.isArray(queries) ? queries : [queries];
}

export function resetMatchingMediaQuery(): void {
  matchingMediaQueries = [];
}
