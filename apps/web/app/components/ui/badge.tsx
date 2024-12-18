import { cva } from "class-variance-authority";

import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import type { IconName } from "~/types/shared";

const badgeVariants = cva(
  "flex shrink-0 items-center h-min text-sm font-medium rounded-lg px-2 py-1 gap-x-2",
  {
    variants: {
      variant: {
        default: "text-neutral-900 bg-white border border-neutral-200",
        success: "text-success-800 bg-success-100",
        successFilled: "text-success-800 bg-success-50",
        inProgress: "text-warning-800 bg-warning-100",
        inProgressFilled: "text-secondary-700 bg-secondary-50",
        notStarted: "text-neutral-600 bg-neutral-100",
        notStartedFilled: "text-neutral-900 bg-white border border-neutral-200",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      outline: {
        true: "bg-transparent border border-current",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      outline: false,
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    icon?: IconName;
  };

export const Badge = ({ className, variant, outline, icon, children, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant, outline }), className)} {...props}>
      {icon && <Icon name={icon} />}
      {children}
    </div>
  );
};
