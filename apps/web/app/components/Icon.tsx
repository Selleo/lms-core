import * as icons from "~/assets/svgs";
import { memo } from "react";
import { IconName, SVGComponentProps } from "~/types/shared";

type IconProps = SVGComponentProps & {
  name: IconName;
};

export const Icon = memo(({ name, className, ...restProps }: IconProps) => {
  const IconComponent = icons[name];

  return <IconComponent {...restProps} className={className} />;
});
