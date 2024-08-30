import { defineConfig } from "tsup";
import type { Plugin as EsbuildPlugin } from "esbuild";
import * as path from "path";

const tailwindPlugin: EsbuildPlugin = {
  name: "tailwind",
  setup(build) {
    build.onResolve({ filter: /^tailwindcss$/ }, () => {
      return { path: path.resolve("./node_modules/tailwindcss") };
    });
  },
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  treeshake: true,
  minify: true,
  esbuildPlugins: [tailwindPlugin],
  outDir: "dist",
  external: ["react"],
  noExternal: ["fs", "path", "url"],
  onSuccess:
    "postcss src/global.css -o dist/global.css --config postcss.config.cjs",
});
