import { Bar, BarChart, CartesianGrid, Customized, Text, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { ChartLegendBadge } from "~/modules/Statistics/Client/components/ChartLegendBadge";

import type { ChartConfig } from "~/components/ui/chart";

const chartConfig = {
  newStudentsCount: {
    label: "Enrollments",
    color: "var(--primary-700)",
  },
} satisfies ChartConfig;

type Data = Record<string, { newStudentsCount: number }> | object | undefined;

type EnrollmentChartProps = {
  data: Data;
  isLoading?: boolean;
};

export const parseRatesChartData = (data: Data) => {
  if (!data) return [];

  return Object.entries(data).map(([month, values]) => ({
    month,
    newStudentsCount: values.newStudentsCount,
  }));
};

export const EnrollmentChart = ({ data, isLoading = false }: EnrollmentChartProps) => {
  const parsedData = parseRatesChartData(data);

  const dataMax = Math.max(...parsedData.map(({ newStudentsCount }) => newStudentsCount));
  const step = Math.ceil(dataMax / 10);
  const yAxisMax = dataMax + step;
  const ticks = Array.from(
    { length: Math.floor(yAxisMax / step) },
    (_, index) => (index + 1) * step,
  );

  const isEmptyChart = parsedData?.every(({ newStudentsCount }) => !newStudentsCount);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg gap-4 md:col-span-2 drop-shadow-card p-8 flex flex-col">
        <hgroup className="gap-y-[5px] flex flex-col items-center py-3">
          <Skeleton className="h-6 w-[240px] rounded-lg" />
          <Skeleton className="w-40 h-4 rounded-lg" />
        </hgroup>
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
              <div className="absolute flex bottom-0 left-2 w-full justify-between">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className={cn("flex gap-x-1", { "hidden md:flex": index > 5 })}>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Skeleton key={index} className="w-3 h-[132px] rounded-lg" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full ml-2 justify-between">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={cn("h-[19px] w-7 rounded-lg", { "hidden md:block": index > 5 })}
                />
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
    <div className="p-8 bg-white flex flex-col rounded-lg gap-y-6 drop-shadow-card md:col-span-2 size-full">
      <hgroup>
        <h2 className="body-lg-md text-neutral-950 text-center">Enrollment</h2>
        <p className="body-sm-md text-center text-neutral-800">Numbers of enrollment in 2024</p>
      </hgroup>
      <div className="grid mt-2 place-items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[224px] w-full h-full"
        >
          <BarChart accessibilityLayer data={parsedData} margin={{ left: -28 }} barCategoryGap={12}>
            <Customized
              component={() => {
                return isEmptyChart ? (
                  <Text
                    x={0}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    className="fill-primary-950 h5 md:h3 translate-x-1/2 translate-y-1/2"
                  >
                    No data available
                  </Text>
                ) : null;
              }}
            />
            <CartesianGrid horizontal={true} vertical={false} />
            {!isEmptyChart && (
              <YAxis ticks={ticks} tickLine={false} axisLine={false} domain={[0, dataMax]} />
            )}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="newStudentsCount" fill="var(--primary-700)" />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex gap-2 justify-center">
        <ChartLegendBadge label="Enrollments" dotColor={chartConfig.newStudentsCount.color} />
      </div>
    </div>
  );
};
