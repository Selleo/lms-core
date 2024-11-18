import { Label, Pie, PieChart } from "recharts";

import { CategoryChip } from "~/components/ui/CategoryChip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

import type { ChartConfig } from "~/components/ui/chart";

const chartData = [
  { answers: "correct", percentage: 74, fill: "var(--primary-700)" },
  { answers: "wrong", percentage: 26, fill: "var(--neutral-100)" },
];

const chartConfig = {
  correct: {
    label: "Correct answers",
    color: "var(--primary-700)",
  },
  wrong: {
    label: "Wrong answers",
    color: "var(--neutral-300)",
  },
} satisfies ChartConfig;

export const AvgQuizzesPercentScore = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg max-w-[389px] gap-6 drop-shadow-card p-8 flex flex-col">
      <h2 className="body-lg-md text-neutral-950 text-center">Avg. Percent Score of Quizzes</h2>
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
              nameKey="answers"
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
                          74%
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
        <CategoryChip category="Correct answers" />
        <CategoryChip category="Wrong answers" color="text-neutral-300" />
      </div>
    </div>
  );
};
