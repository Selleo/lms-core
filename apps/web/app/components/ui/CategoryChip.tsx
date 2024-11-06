import { Dot } from "lucide-react";

import { cn } from "~/lib/utils";

type CategoryChipProps = {
  category: string;
  color?: string;
  className?: string;
};

export const CategoryChip = ({
  category,
  color = "text-primary-700",
  className,
}: CategoryChipProps) => {
  const dotClasses = cn("flex-shrink-0", color);

  return (
    <div
      className={cn("max-w-fit bg-white px-2 py-1 rounded-lg items-center flex gap-2", className)}
    >
      <Dot size={8} strokeWidth={4} className={dotClasses} absoluteStrokeWidth />
      <div className="truncate text-xs text-primary-950">{category}</div>
    </div>
  );
};
