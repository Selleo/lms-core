import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { installGlobals } from "@remix-run/node";
import { server } from "~/utils/mocks/node";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

installGlobals();

beforeAll(() => {
  server.listen();
  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
