import * as icons from "~/assets/svgs";
import type { SVGProps } from "react";

export type SVGComponentProps = SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;
