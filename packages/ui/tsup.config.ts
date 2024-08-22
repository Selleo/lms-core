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
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: ["react"],
  esbuildPlugins: [tailwindPlugin],
  onSuccess:
    "postcss src/index.css -o dist/global.css --config postcss.config.cjs",
});
