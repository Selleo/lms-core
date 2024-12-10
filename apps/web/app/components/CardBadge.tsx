import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "w-fit inline-flex items-center details-md px-1 py-0.5 gap-x-1 rounded-lg bg-white",
  {
    variants: {
      variant: {
        default: "text-neutral-900",
        primary: "text-primary-950",
        secondary: "text-secondary-700",
        secondaryFilled: "text-secondary-700 bg-secondary-50",
        successOutlined: "text-success-800",
        successFilled: "text-white bg-success-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export const CardBadge = ({ className, variant, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
};
