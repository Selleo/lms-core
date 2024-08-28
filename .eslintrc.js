// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },

  settings: {
    "import/resolver": {
      // alias: {
      //   map: [["@ui", "./packages/ui/src/components/ui"]],
      //   extensions: [".js", ".jsx", ".ts", ".tsx"],
      // },
    },
  },
};
