import { useMemo } from "react";

import { useCurrentUser } from "~/api/queries";
import { useUserStatistics } from "~/api/queries/useUserStatistics";
import { Gravatar } from "~/components/Gravatar";
import { Avatar } from "~/components/ui/avatar";

import {
  AvgPercentScoreChart,
  ContinueLearningCard,
  ProfileWithCalendar,
  RatesChart,
} from "./components";
import { parseRatesChartData } from "./utils";

import type { ChartConfig } from "~/components/ui/chart";

export default function StatisticsPage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: userStatistics, isLoading } = useUserStatistics();

  const coursesChartData = useMemo(
    () => [
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
    ],
    [
      userStatistics?.averageStats.courseStats.completed,
      userStatistics?.averageStats.courseStats.started,
    ],
  );

  const coursesChartConfig = {
    completed: {
      label: "Completed Courses",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Started Courses",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const quizzesChartData = useMemo(
    () => [
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
    ],
    [userStatistics?.quizzes.totalCorrectAnswers, userStatistics?.quizzes.totalWrongAnswers],
  );

  const quizzesChartConfig = {
    completed: {
      label: "Correct answers",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Wrong answers",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const lessonRatesChartData = parseRatesChartData(userStatistics?.lessons);
  const coursesRatesChartData = parseRatesChartData(userStatistics?.courses);

  return (
    <div className="flex px-4 flex-col gap-y-6 2xl:gap-y-6 md:px-6 2xl:p-2">
      <div className="gap-x-2 flex 2xl:gap-x-4 items-center">
        <p className="h5 2xl:h2 text-neutral-950">Welcome back, {user?.firstName}</p>
        <Avatar className="size-12">
          <Gravatar email={user?.email} />
        </Avatar>
      </div>
      <div className="flex items-center flex-col-reverse 2xl:flex-row gap-y-4 h-full gap-x-7 2xl:h-[calc(100dvh-161px)]">
        <div className="w-full h-full gap-y-4 2xl:gap-x-4 2xl:gap-y-6 flex flex-col">
          <div className="flex flex-wrap 2xl:flex-nowrap gap-4 w-full h-full">
            <ContinueLearningCard isLoading={isLoading} lesson={userStatistics?.lastLesson} />
            <AvgPercentScoreChart
              label={`${userStatistics?.quizzes.averageScore}`}
              title="Avg. Percent Score of Quizzes"
              chartConfig={quizzesChartConfig}
              chartData={quizzesChartData}
              isLoading={isLoading}
            />
            <AvgPercentScoreChart
              label={`${userStatistics?.averageStats.courseStats.completionRate}`}
              title="Avg. Percent of Course Competition"
              chartConfig={coursesChartConfig}
              chartData={coursesChartData}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col 2xl:gap-x-4 2xl:flex-row w-full h-full gap-y-4">
            <div className="w-full h-full bg-white rounded-lg 2xl:max-w-[592px] drop-shadow-card">
              <RatesChart
                resourceName="Courses"
                chartData={coursesRatesChartData}
                isLoading={isLoading}
              />
            </div>
            <div className="w-full h-full bg-white rounded-lg 2xl:max-w-[592px] drop-shadow-card">
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
          isLoading={isLoading || isUserLoading}
          streak={userStatistics?.streak}
        />
      </div>
    </div>
  );
}