import { cn } from "~/lib/utils";

import type { HTMLAttributes } from "react";

type PageWrapperProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const PageWrapper = ({ className, ...props }: PageWrapperProps) => {
  const classes = cn(
    "size-full pt-6 px-4 pb-4 md:px-6 md:pb-6 2xl:pt-12 2xl:px-8 2xl:pb-8",
    className,
  );
  return <div className={classes} {...props} />;
};
