import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

import type { ChartConfig } from "~/components/ui/chart";

type CourseProgressChartProps = {
  chaptersCount: number | undefined;
  completedChaptersCount: number | undefined;
};

const emptyChartData = {
  state: "No data",
  chaptersCount: 1,
  fill: "var(--neutral-200)",
};

const chartConfig = {
  completed: {
    label: "remainingChapters.sideSection.other.completedChapters",
    color: "var(--success-500)",
  },
  notCompleted: {
    label: "remainingChapters.sideSection.other.remainingChapters",
    color: "var(--primary-100)",
  },
} satisfies ChartConfig;

export const CourseProgressChart = ({
  chaptersCount = 0,
  completedChaptersCount = 0,
}: CourseProgressChartProps) => {
  const { t } = useTranslation();
  const chartData = useMemo(
    () => [
      {
        state: "Completed Chapters",
        chaptersCount: completedChaptersCount,
        fill: "var(--success-500)",
      },
      {
        state: "Remaining chapters",
        chaptersCount: chaptersCount - completedChaptersCount,
        fill: "var(--primary-100)",
      },
    ],
    [completedChaptersCount, chaptersCount],
  );

  const isEmptyChart = chartData.every(({ chaptersCount }) => !chaptersCount);

  return (
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
            dataKey="chaptersCount"
            nameKey="state"
            innerRadius={89}
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
                        {isEmptyChart
                          ? t("studentCourseView.sideSection.other.noData")
                          : `${completedChaptersCount}/${chaptersCount}`}
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
  );
};
