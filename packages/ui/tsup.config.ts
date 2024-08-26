import { defineConfig } from "tsup";
import type { Plugin } from "esbuild";
import * as path from "path";

// const tailwindPlugin: Plugin = {
//   name: "tailwind",
//   setup(build) {
//     build.onResolve({ filter: /^tailwindcss$/ }, (args) => {
//       return { path: path.resolve("./node_modules/tailwindcss") };
//     });
//   },
// };

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  // external: ["react"],
  // esbuildPlugins: [tailwindPlugin],
  external: ["tailwindcss", "postcss", "autoprefixer"],
  onSuccess:
    "postcss src/styles.css -o dist/styles.css --config postcss.config.cjs",
});
