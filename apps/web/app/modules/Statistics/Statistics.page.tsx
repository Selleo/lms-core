import { useEffect, useState } from "react";

import { useCurrentUser } from "~/api/queries";
import { useUserStatistics } from "~/api/queries/useUserStatistics";
import { Gravatar } from "~/components/Gravatar";
import { Avatar } from "~/components/ui/avatar";
import { AvgPercentScoreChart } from "~/modules/Statistics/components/AvgPercentScoreChart";
import { ContinueLearningCard } from "~/modules/Statistics/components/ContinueLearningCard";
import { ProfileWithCalendar } from "~/modules/Statistics/components/ProfileWithCalendar";
import { RatesChart } from "~/modules/Statistics/components/RatesChart";

import type { ChartConfig } from "~/components/ui/chart";

const chartData2 = [
  { state: "Completed", percentage: 0, fill: "var(--primary-700)" },
  { state: "Started", percentage: 1, fill: "var(--primary-300)" },
];

const chartConfig2 = {
  completed: {
    label: "Completed Courses",
    color: "var(--primary-700)",
  },
  notCompleted: {
    label: "Started Courses",
    color: "var(--primary-300)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", completed: 0, started: 0 },
  { month: "February", completed: 0, started: 0 },
  { month: "March", completed: 0, started: 0 },
  { month: "April", completed: 0, started: 0 },
  { month: "May", completed: 0, started: 0 },
  { month: "June", completed: 0, started: 0 },
  { month: "July", completed: 0, started: 0 },
  { month: "August", completed: 0, started: 0 },
  { month: "September", completed: 0, started: 0 },
  { month: "October", completed: 0, started: 0 },
  { month: "November", completed: 0, started: 0 },
  { month: "December", completed: 0, started: 0 },
];

export default function StatisticsPage() {
  const { data: user } = useCurrentUser();
  const { data: userStatistics } = useUserStatistics();

  console.log({ userStatistics });

  const chartData1 = [
    { state: "Correct", percentage: 0, fill: "var(--primary-700)" },
    { state: "Wrong", percentage: 1, fill: "var(--primary-300)" },
  ];

  const chartConfig1 = {
    completed: {
      label: "Correct answers",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Wrong answers",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const coursesChartData = [
    {
      state: "Completed Courses",
      percentage: userStatistics?.averageStats.courseStats.completed,
      fill: "var(--primary-700)",
    },
    {
      state: "Started Courses",
      percentage: userStatistics?.averageStats.courseStats.started,
      fill: "var(--primary-700)",
    },
  ];

  const coursesChartConfig = {
    completed: {
      label: "Completed",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Started",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const quizesChartData = [
    {
      state: "Correct Answers",
      percentage: userStatistics?.quizzes.totalCorrectAnswers,
      fill: "var(--primary-700)",
    },
    {
      state: "Wrong Answers",
      percentage: userStatistics?.quizzes.totalWrongAnswers,
      fill: "var(--primary-700)",
    },
  ];

  const quizesChartConfig = {
    completed: {
      label: "Correct answers",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Wrong answers",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  function transformData(data) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months.map((month) => {
      return {
        month: month,
        completed: data?.[month]?.completed,
        started: data?.[month]?.started,
      };
    });
  }

  const lessonRatesChartData = transformData(userStatistics?.lessons);
  const coursesRatesChartData = transformData(userStatistics?.courses);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex px-4 flex-col gap-y-6 lg:gap-y-6 md:px-6 lg:p-2">
      <div className="gap-x-2 flex lg:gap-x-4 items-center">
        <p className="h5 lg:h2 text-neutral-950">Welcome back, {user?.firstName}</p>
        <Avatar className="size-12">
          <Gravatar email={user?.email} />
        </Avatar>
      </div>
      <div className="flex items-center flex-col-reverse lg:flex-row gap-y-4 h-full gap-x-7 lg:h-[calc(100dvh-161px)]">
        <div className="w-full h-full gap-y-4 lg:gap-x-4 lg:gap-y-6 flex flex-col">
          <div className="flex flex-wrap gap-4 w-full h-full">
            <ContinueLearningCard isLoading={isLoading} lesson={userStatistics?.lastLesson} />
            <AvgPercentScoreChart
              label={`${userStatistics?.quizzes.averageScore}`}
              title="Avg. Percent Score of Quizzes"
              chartConfig={quizesChartConfig}
              chartData={quizesChartData}
              isLoading={isLoading}
            />
            <AvgPercentScoreChart
              label={userStatistics?.averageStats.courseStats.completionRate}
              title="Avg. Percent of Course Competition"
              chartConfig={coursesChartConfig}
              chartData={coursesChartData}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col lg:gap-x-4 lg:flex-row w-full h-full gap-y-4">
            <div className="w-full h-full bg-white rounded-lg lg:max-w-[592px] drop-shadow-card">
              <RatesChart
                resourceName="Courses"
                chartData={coursesRatesChartData}
                isLoading={isLoading}
              />
            </div>
            <div className="w-full h-full bg-white rounded-lg lg:max-w-[592px] drop-shadow-card">
              <RatesChart
                resourceName="Lessons"
                chartData={lessonRatesChartData}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
        <ProfileWithCalendar
          user={user}
          isLoading={isLoading}
          streakStatistics={userStatistics?.streak}
        />
      </div>
    </div>
  );
}
