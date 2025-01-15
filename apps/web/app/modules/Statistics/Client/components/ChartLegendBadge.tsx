import type { ReactNode } from "react";

type ChartLegendBadgeProps = {
  label: ReactNode | string | undefined;
  dotColor: string | undefined;
};

export const ChartLegendBadge = ({ label = "", dotColor = "#3F58B6" }: ChartLegendBadgeProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-lg bg-neutral-50 px-2 py-1">
      <div className="aspect-square size-2 rounded-full" style={{ backgroundColor: dotColor }} />
      <span className="details-md text-primary-950">{label}</span>
    </div>
  );
};
