import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { ChartLegendBadge } from "~/modules/Statistics/components/ChartLegendBadge";

import type { ChartConfig } from "~/components/ui/chart";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--primary-700)",
  },
  started: {
    label: "Started",
    color: "var(--primary-300)",
  },
} satisfies ChartConfig;

interface ChartData {
  month: string;
  completed: number;
  started: number;
}

type RatesChartProps = {
  isLoading?: boolean;
  resourceName: string;
  chartData: ChartData[];
};

export const RatesChart = ({ isLoading = false, resourceName, chartData }: RatesChartProps) => {
  const dataMax = Math.max(...chartData.map((d) => d.started));
  const step = Math.ceil(dataMax / 10);
  const yAxisMax = dataMax + step;
  const ticks = Array.from({ length: Math.floor(yAxisMax / step) }, (_, i) => (i + 1) * step);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg gap-4 drop-shadow-card p-8 flex flex-col">
        <hgroup className="gap-y-[5px] flex flex-col items-center py-3">
          <Skeleton className="h-6 w-[240px] rounded-lg" />
          <Skeleton className="w-40 h-4 rounded-lg" />
        </hgroup>
        {/*<div className=""></div>*/}
        <div className="w-full h-[273px] flex gap-x-2 items-center">
          <div className="flex flex-col gap-y-4 h-full mt-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-2 w-3 rounded-lg" />
            ))}
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            <div className="flex flex-col w-full gap-y-[23px] relative">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-[1px] w-full" />
              ))}
              <div className="absolute flex bottom-0 left-2 gap-x-[14px]">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex gap-x-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Skeleton key={index} className="w-3 h-[132px] rounded-lg" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full ml-2 gap-x-[14px]">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="h-[19px] w-7 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <Skeleton className="w-[126px] h-[27px] rounded-lg" />
          <Skeleton className="w-[126px] h-[27px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg gap-4 drop-shadow-card p-8 flex flex-col">
      <hgroup>
        <h2 className="body-lg-md text-neutral-950 text-center">{resourceName} Rates</h2>
        <p className="body-sm-md text-center text-neutral-800">Number of {resourceName} in 2024</p>
      </hgroup>
      <div className="grid mt-2 place-items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[273px] w-full h-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid horizontal={true} vertical={false} />
            <YAxis ticks={ticks} tickLine={false} axisLine={false} domain={[0, dataMax]} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="completed" fill="var(--color-completed)" />
            <Bar dataKey="started" fill="var(--color-started)" />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex gap-2 justify-center">
        {Object.values(chartConfig).map((config) => {
          return (
            <ChartLegendBadge
              key={config.label as string}
              label={config.label}
              dotColor={config.color}
            />
          );
        })}
      </div>
    </div>
  );
};
