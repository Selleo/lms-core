import { useMemo } from "react";

import { useCurrentUser } from "~/api/queries";
import { useUserStatistics } from "~/api/queries/useUserStatistics";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";
import { parseRatesChartData } from "~/modules/Statistics/utils";

import {
  AvgPercentScoreChart,
  ContinueLearningCard,
  ProfileWithCalendar,
  RatesChart,
} from "./components";

import type { ChartConfig } from "~/components/ui/chart";

export default function ClientStatistics() {
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
        fill: "var(--primary-300)",
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
        fill: "var(--primary-300)",
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
    <PageWrapper className="2xl:!pt-8">
      <div className="flex flex-col gap-y-6 2xl:gap-y-6">
        <div className="gap-x-2 flex 2xl:gap-x-4 items-center">
          <p className="h5 2xl:h2 text-neutral-950">Welcome back, {user?.firstName}</p>
          <Avatar className="size-12">
            <Gravatar email={user?.email} />
          </Avatar>
        </div>
        <div className="grid items-center flex-col-reverse 2xl:grid-cols-[1fr_384px] grid-cols-1 gap-y-4 h-full gap-x-7 2xl:h-full">
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
              <RatesChart
                resourceName="Courses"
                chartData={coursesRatesChartData}
                isLoading={isLoading}
              />
              <RatesChart
                resourceName="Lessons"
                chartData={lessonRatesChartData}
                isLoading={isLoading}
              />
            </div>
          </div>
          <ProfileWithCalendar
            user={user}
            isLoading={isLoading || isUserLoading}
            streak={userStatistics?.streak}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
