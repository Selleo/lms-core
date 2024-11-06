export default {
  "*.{js,jsx,ts,tsx}": [
    () => "pnpm format:check",
    () => "pnpm lint-tsc-web",
    () => "pnpm lint-tsc-api",
  ],
  "*.{json,md,css,scss,html,yml,yaml}": [() => "pnpm format:check"],
};
