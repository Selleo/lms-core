import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { ChartLegendBadge } from "~/modules/Statistics/Client/components";

import type { GetTeacherStatsResponse } from "~/api/generated-api";
import { useTranslation } from "react-i18next";

type Data = GetTeacherStatsResponse["data"]["fiveMostPopularCourses"];

type MostPopularCoursesChartProps = { data: Data | undefined; isLoading: boolean | undefined };

type ChartData = {
  courseName: string;
  studentCount: number;
  [key: string]: string | number;
}[];

type ChartConfig = {
  [key: string]: {
    label: string;
  };
};

const chartColors = [
  "var(--primary-700)",
  "var(--cabaret-600)",
  "var(--zest-500)",
  "var(--amethyst-600)",
  "var(--mountain-meadow-500)",
];

export const FiveMostPopularCoursesChart = ({ data, isLoading }: MostPopularCoursesChartProps) => {
  const isTablet = useMediaQuery({ minWidth: 768 });
  const { t } = useTranslation();

  function generateChartData(input: Data | undefined): {
    chartData: ChartData | undefined;
    chartConfig: ChartConfig | undefined;
  } {
    const chartData = input?.map(({ courseName, studentCount }, index) => ({
      courseName,
      studentCount,
      fill: chartColors[index % chartColors.length],
    }));

    const chartConfig = input?.reduce((config, { courseName }, index) => {
      const key = `desktop${index === 0 ? "" : index}`;
      config[key] = { label: courseName };
      return config;
    }, {} as ChartConfig);

    return { chartData, chartConfig };
  }

  const { chartData, chartConfig } = generateChartData(data);

  const isEmptyChart =
    chartData?.every(({ studentCount }) => !studentCount) || !data || !chartConfig;

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 w-full flex flex-col">
        <div className="flex flex-col py-[5px] items-center gap-y-[5px] pb-6 md:pb-4">
          <Skeleton className="bg-neutral-100 rounded-lg w-[240px] h-6" />
          <Skeleton className="bg-neutral-100 rounded-lg w-40 h-4" />
        </div>
        <div className="md:flex md:gap-x-3 md:size-full">
          <div className="sr-only md:not-sr-only md:flex md:h-full md:flex-col md:gap-y-10 md:py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="py-1 flex items-center">
                <Skeleton className="bg-neutral-100 rounded-lg w-40 h-4" />
              </div>
            ))}
          </div>
          <div className="flex flex-col py-2 gap-y-3 w-full relative md:gap-y-10">
            <Skeleton className="bg-neutral-100 rounded-lg w-[93%] h-6" />
            <Skeleton className="bg-neutral-100 rounded-lg w-[68%] h-6" />
            <Skeleton className="bg-neutral-100 rounded-lg w-[56%] h-6" />
            <Skeleton className="bg-neutral-100 rounded-lg w-[40%] h-6" />
            <Skeleton className="bg-neutral-100 rounded-lg w-[34%] h-6" />
            <div className="flex justify-between absolute top-0 left-0 w-full h-full">
              {Array.from({ length: 21 }).map((_, index) => (
                <Skeleton key={index} className="w-[1px] h-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-2 md:pl-[172px]">
          <Skeleton className="bg-neutral-100 rounded-lg h-2 w-2" />
          <Skeleton className="bg-neutral-100 rounded-lg h-2 w-6" />
          <Skeleton className="bg-neutral-100 rounded-lg h-2 w-6" />
          <Skeleton className="bg-neutral-100 rounded-lg h-2 w-6" />
          <Skeleton className="bg-neutral-100 rounded-lg h-2 w-7" />
        </div>
        <div className="flex flex-col gap-y-2 pt-6 md:sr-only">
          <Skeleton className="bg-neutral-100 rounded-lg h-[27px]" />
          <Skeleton className="bg-neutral-100 rounded-lg h-[27px]" />
          <Skeleton className="bg-neutral-100 rounded-lg h-[27px]" />
          <Skeleton className="bg-neutral-100 rounded-lg h-[27px]" />
          <Skeleton className="bg-neutral-100 rounded-lg h-[27px]" />
        </div>
      </div>
    );
  }

  if (isEmptyChart) {
    return (
      <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 gap-y-6 md:gap-y-4 xl:col-span-2 w-full flex flex-col">
        <hgroup>
          <h2 className="body-lg-md text-neutral-950 text-center">
            {t("mostPopularCoursesView.header")}
          </h2>
          <p className="body-sm-md text-center text-neutral-800">
            {t("mostPopularCoursesView.subHeader")}
          </p>
        </hgroup>
        <div className="md:flex md:gap-x-3 md:size-full">
          <div className="flex py-2 h-full items-center min-h-[200px] md:min-h-[316px] justify-between gap-y-3 w-full relative md:gap-y-10">
            {Array.from({ length: 21 }).map((_, index) => (
              <div key={index} className="w-[1px] bg-neutral-100 h-full" />
            ))}
            <div className="flex text-primary-950 h5 md:h3 absolute z-0 top-0 left-0 size-full justify-center items-center">
              {t("mostPopularCoursesView.other.noData")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 gap-y-6 2xl:gap-y-6 md:gap-y-4 w-full flex flex-col">
      <hgroup>
        <h2 className="body-lg-md text-neutral-950 text-center">
          {t("mostPopularCoursesView.header")}
        </h2>
        <p className="body-sm-md text-center text-neutral-800">
          {t("mostPopularCoursesView.subHeader")}
        </p>
      </hgroup>
      <ChartContainer config={chartConfig} className="h-[316px]">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: -28,
          }}
          barCategoryGap="16.5"
        >
          <XAxis
            type="number"
            dataKey="studentCount"
            axisLine={false}
            tickFormatter={(value, index) => (index === 0 || index % 5 === 0 ? value : "")}
            tickCount={21}
            tickSize={0}
          />
          <YAxis
            dataKey="courseName"
            type="category"
            tickLine={false}
            tickMargin={10}
            width={isTablet ? 168 : 0}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="1 0" horizontal={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="studentCount">
            <LabelList
              dataKey="studentCount"
              position="insideLeft"
              offset={isTablet ? 8 : 36}
              className="fill-[--color-white]"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="flex flex-col gap-2 md:sr-only">
        {data?.map(({ courseName }, index) => (
          <ChartLegendBadge key={courseName} label={courseName} dotColor={chartColors[index]} />
        ))}
      </div>
    </div>
  );
};
