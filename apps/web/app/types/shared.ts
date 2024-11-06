import type { SVGProps } from "react";
import type * as icons from "~/assets/svgs";

export type SVGComponentProps = SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;

export type CourseListLayout = "table" | "card";
