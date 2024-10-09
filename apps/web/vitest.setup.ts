import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { installGlobals } from "@remix-run/node";
import { server } from "~/utils/mocks/node";
import "./app/utils/mocks/intersectionObserver.mock";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

installGlobals();

beforeAll(() => {
  server.listen();
  window.ResizeObserver = ResizeObserver;
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
