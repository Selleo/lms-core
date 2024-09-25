import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { routes } from "./routes";
import path from "path";
import svgr from "vite-plugin-svgr";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
    viteStaticCopy({
      targets: [
        {
          src: "app/assets/favicon.ico",
          dest: "",
        },
      ],
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "~/": path.resolve(__dirname, "./app"),
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes("@remix-run")) {
            return "remix";
          }
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["@remix-run/react", "@remix-run/router"],
  },
});
