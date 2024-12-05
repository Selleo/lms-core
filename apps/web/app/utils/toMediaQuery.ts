import type { ToMediaQueryObjectParam } from "~/types/shared";

const _toMediaQuerySizeComponent = (name: string, value: string) => {
  return `(${name}: ${value})`;
};

export const toMediaQuery = (param: string | ToMediaQueryObjectParam) => {
  if (typeof param === "string") return param;

  const components: string[] = [];

  if (param.minWidth) {
    components.push(_toMediaQuerySizeComponent("min-width", param.minWidth + "px"));
  }

  if (param.maxWidth) {
    components.push(_toMediaQuerySizeComponent("max-width", param.maxWidth + "px"));
  }

  return components.join(" and ");
};
