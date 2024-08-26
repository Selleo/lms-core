/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "babel-plugin-macros.config.cjs",
    "postcss.config.cjs",
    "tailwind.config.js",
    "**/*.d.ts",
  ],
};
