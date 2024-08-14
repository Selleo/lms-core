import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { routes } from "./routes";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgr(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
      },
      ssr: false, // SPA MODE - Might migrate to React Router 7
      routes,
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "~/*": path.resolve(__dirname, "./app"),
    },
  },
});
