import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Customized, Text, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { ChartLegendBadge } from "~/modules/Statistics/Client/components/ChartLegendBadge";

import type { ChartConfig } from "~/components/ui/chart";

const chartConfig = {
  newStudentsCount: {
    label: t("enrollmentChartView.other.enrollments"),
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
  const { t } = useTranslation();

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
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-8 drop-shadow-card md:col-span-2">
        <hgroup className="flex flex-col items-center gap-y-[5px] py-3">
          <Skeleton className="h-6 w-[240px] rounded-lg" />
          <Skeleton className="h-4 w-40 rounded-lg" />
        </hgroup>
        <div className="flex h-[273px] w-full items-center gap-x-2">
          <div className="mt-6 flex h-full flex-col gap-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-2 w-3 rounded-lg" />
            ))}
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <div className="relative flex w-full flex-col gap-y-[23px]">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-[1px] w-full" />
              ))}
              <div className="absolute bottom-0 left-2 flex w-full justify-between">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className={cn("flex gap-x-1", { "hidden md:flex": index > 5 })}>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Skeleton key={index} className="h-[132px] w-3 rounded-lg" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-2 flex w-full justify-between">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={cn("h-[19px] w-7 rounded-lg", { "hidden md:block": index > 5 })}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-[27px] w-[126px] rounded-lg" />
          <Skeleton className="h-[27px] w-[126px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col gap-y-6 rounded-lg bg-white p-8 drop-shadow-card md:col-span-2">
      <hgroup>
        <h2 className="body-lg-md text-center text-neutral-950">
          {t("enrollmentChartView.header")}
        </h2>
        <p className="body-sm-md text-center text-neutral-800">
          {t("enrollmentChartView.subHeader")}
        </p>
      </hgroup>
      <div className="mt-2 grid h-full place-items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[224px] w-full"
        >
          <BarChart accessibilityLayer data={parsedData} margin={{ left: -28 }} barCategoryGap={12}>
            <Customized
              component={() => {
                return isEmptyChart ? (
                  <Text
                    x={0}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    className="h5 md:h3 translate-x-1/2 translate-y-1/2 fill-primary-950"
                  >
                    {t("enrollmentChartView.other.noData")}
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
      <div className="flex justify-center gap-2">
        <ChartLegendBadge
          label={t("enrollmentChartView.other.enrollments")}
          dotColor={chartConfig.newStudentsCount.color}
        />
      </div>
    </div>
  );
};
