import { Label, Pie, PieChart } from "recharts";

import { CategoryChip } from "~/components/ui/CategoryChip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

import type { ChartConfig } from "~/components/ui/chart";

const chartData = [
  { state: "correct", percentage: 92, fill: "var(--primary-700)" },
  { state: "wrong", percentage: 8, fill: "var(--neutral-100)" },
];

const chartConfig = {
  completed: {
    label: "Correct answers",
    color: "var(--primary-700)",
  },
  notCompleted: {
    label: "Wrong answers",
    color: "var(--neutral-300)",
  },
} satisfies ChartConfig;

export const AvgCoursePercentCompletition = () => {
  return (
    <div className="w-full max-w-[389px] h-full bg-white rounded-lg gap-6 drop-shadow-card p-8 flex flex-col">
      <h2 className="body-lg-md text-neutral-950 text-center">
        Avg. Percent of Course Completition
      </h2>
      <div className="grid place-items-center h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full h-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
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
                          92%
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
      <div className="flex gap-2 justify-center">
        <CategoryChip category="Completed Courses" />
        <CategoryChip category="Started Courses" color="text-neutral-300" />
      </div>
    </div>
  );
};
