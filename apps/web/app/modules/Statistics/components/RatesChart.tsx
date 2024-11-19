import { CartesianGrid, XAxis, Bar, BarChart, YAxis } from "recharts";

import { CategoryChip } from "~/components/ui/CategoryChip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

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

export const RatesChart = ({
  resourceName,
  chartData,
}: {
  resourceName: string;
  chartData: ChartData[];
}) => {
  const dataMax = Math.max(...chartData.map((d) => d.started));
  const step = Math.ceil(dataMax / 10);
  const yAxisMax = dataMax + step;
  const ticks = Array.from({ length: Math.floor(yAxisMax / step) }, (_, i) => (i + 1) * step);

  return (
    <div className="w-full h-full bg-white rounded-lg  gap-6 drop-shadow-card p-8 flex flex-col">
      <h2 className="body-lg-md text-neutral-950 text-center">{resourceName} Rates</h2>
      <p className="body-sm-md text-center text-neutral-800">Number of {resourceName} in 2024</p>
      <div className="grid place-items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[450px] w-full h-full"
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
        <CategoryChip
          category={`Completed ${resourceName}`}
          color="text-primary-950"
          className="details-md bg-neutral-50"
        />
        <CategoryChip
          category={`Started ${resourceName}`}
          color="text-primary-300"
          className="details-md bg-neutral-50"
        />
      </div>
    </div>
  );
};
