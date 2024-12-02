import type { SVGProps } from "react";
import type * as icons from "~/assets/svgs";

export type SVGComponentProps = SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;

export type CourseListLayout = "table" | "card";

export type AtLeastOne<T> = {
  [K in keyof T]-?: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

export type ToMediaQueryObjectParam = AtLeastOne<{
  minWidth?: number;
  maxWidth?: number;
}>;
