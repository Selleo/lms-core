import path from "path";

import { vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import { routes } from "./routes";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      svgr(),
      cjsInterop({
        dependencies: ["react-use"],
      }),
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
      sentryVitePlugin({
        org: env.VITE_SENTRY_ORG,
        project: env.VITE_SENTRY_PROJECT,
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: "./build/client/**",
        },
        telemetry: false,
      }),
    ],
    resolve: {
      alias: {
        "~/": path.resolve(__dirname, "./app"),
      },
    },
    build: {
      sourcemap: true,
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
      include: ["@remix-run/react", "@remix-run/router", "crypto-js"],
    },
  };
});
