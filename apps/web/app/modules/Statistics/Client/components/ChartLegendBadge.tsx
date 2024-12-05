import type { ReactNode } from "react";

type ChartLegendBadgeProps = {
  label: ReactNode | string | undefined;
  dotColor: string | undefined;
};

export const ChartLegendBadge = ({ label = "", dotColor = "#3F58B6" }: ChartLegendBadgeProps) => {
  return (
    <div className="flex gap-x-2 items-center bg-neutral-50 rounded-lg px-2 py-1">
      <div className="rounded-full size-2 aspect-square" style={{ backgroundColor: dotColor }} />
      <span className="details-md text-primary-950">{label}</span>
    </div>
  );
};
