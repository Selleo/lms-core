import { Bar, BarChart, CartesianGrid, Customized, Text, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { ChartLegendBadge } from "~/modules/Statistics/Client/components";

import type { GetTeacherStatsResponse } from "~/api/generated-api";

type Data = GetTeacherStatsResponse["data"]["mostFivePopularCourses"];

type MostPopularCoursesChartProps = { data: Data };

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
  "hsla(340, 75%, 55%, 1)",
  "hsla(30, 80%, 55%, 1)",
  "hsla(280, 65%, 60%, 1)",
  "hsla(160, 60%, 45%, 1)",
];

export const FiveMostPopularCoursesChart = ({ data }: MostPopularCoursesChartProps) => {
  const isTablet = useMediaQuery({ minWidth: 768 });

  function generateChartData(input: Data): {
    chartData: ChartData;
    chartConfig: ChartConfig;
  } {
    const chartData = input.map(({ courseName, studentCount }, index) => ({
      courseName,
      chart: `desktop${index === 0 ? "" : index}`,
      studentCount,
      fill: chartColors[index % chartColors.length],
    }));

    const chartConfig = input.reduce((config, { courseName }, index) => {
      const key = `desktop${index === 0 ? "" : index}`;
      config[key] = { label: courseName };
      return config;
    }, {} as ChartConfig);

    return { chartData, chartConfig };
  }

  const { chartData, chartConfig } = generateChartData(data);

  const isEmptyChart = chartData.every(({ studentCount }) => !studentCount);

  return (
    <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 gap-y-4 w-full flex flex-col">
      <hgroup>
        <h2 className="body-lg-md text-neutral-950 text-center">Most Popular</h2>
        <p className="body-sm-md text-center text-neutral-800">Your top 5 Courses</p>
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
          <XAxis type="number" dataKey="studentCount" axisLine={false} />
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
          <Bar dataKey="studentCount" />
        </BarChart>
      </ChartContainer>
      <div className="flex flex-col gap-2 md:sr-only">
        {data.map(({ courseName }, index) => (
          <ChartLegendBadge key={courseName} label={courseName} dotColor={chartColors[index]} />
        ))}
      </div>
    </div>
  );
};
