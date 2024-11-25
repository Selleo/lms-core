import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { ChartLegendBadge } from "~/modules/Statistics/components/ChartLegendBadge";

import type { ChartConfig } from "~/components/ui/chart";

type AvgPercentScoreChartProps = {
  label: string;
  title: string;
  chartConfig: ChartConfig;
  chartData: { state: string; percentage: number | undefined; fill: string }[];
  isLoading?: boolean;
};

const emptyChartData = {
  state: "No data",
  percentage: 1,
  fill: "var(--neutral-200)",
};

export const AvgPercentScoreChart = ({
  label,
  title,
  chartConfig,
  chartData,
  isLoading = false,
}: AvgPercentScoreChartProps) => {
  const chartLegend = useMemo(() => {
    return Object.values(chartConfig).map((config) => {
      return (
        <ChartLegendBadge
          key={config.label as string}
          label={config.label}
          dotColor={config.color}
        />
      );
    });
  }, [chartConfig]);

  const isEmptyChart = chartData.every(({ percentage }) => !percentage);

  if (isLoading) {
    return (
      <div className="w-full h-auto md:w-[calc(50%-8px)] 2xl:max-w-[436px] bg-white items-center rounded-lg gap-6 drop-shadow-card p-8 flex flex-col">
        <Skeleton className="max-w-[240px] w-full h-[30px] rounded-lg" />
        <div className="grid place-items-center h-[250px]">
          <Skeleton className="aspect-square max-h-[200px] w-full h-full rounded-full" />
        </div>
        <div className="flex gap-2 justify-center">
          <Skeleton className="w-[126px] h-[27px] rounded-lg" />
          <Skeleton className="w-[126px] h-[27px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[calc(50%-8px)] h-auto 2xl:max-w-[436px] bg-white rounded-lg gap-6 drop-shadow-card p-8 flex flex-col">
      <h2 className="body-lg-md text-neutral-950 text-center">{title}</h2>
      <div className="grid place-items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] size-full"
        >
          <PieChart>
            {!isEmptyChart && (
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            )}
            <Pie
              data={isEmptyChart ? [emptyChartData, ...chartData] : chartData}
              dataKey="percentage"
              nameKey="state"
              innerRadius={88}
              strokeWidth={5}
              startAngle={90}
              endAngle={-270}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-primary-950 h3">
                          {isEmptyChart ? "No data" : `${label}%`}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex gap-2 justify-center">{chartLegend}</div>
    </div>
  );
};
