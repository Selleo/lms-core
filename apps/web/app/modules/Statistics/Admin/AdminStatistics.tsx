import { useMemo } from "react";

import { useCurrentUser, useTeacherStatistics } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";
import { AvgScoreAcrossAllQuizzesChart } from "~/modules/Statistics/Admin/components/AvgScoreAcrossAllQuizzessChart";
import { ConversionsAfterFreemiumLessonChart } from "~/modules/Statistics/Admin/components/ConversionsAfterFreemiumLessonChart";

import { CourseCompletionPercentageChart, FiveMostPopularCoursesChart } from "./components";

import type { ChartConfig } from "~/components/ui/chart";

export const AdminStatistics = () => {
  const { data: user } = useCurrentUser();
  const { data: statistics, isLoading } = useTeacherStatistics();

  const totalCoursesCompletion = statistics?.totalCoursesCompletionStats.totalCoursesCompletion;
  const totalCourses = statistics?.totalCoursesCompletionStats.totalCourses;

  const purchasedCourses = statistics?.conversionAfterFreemiumLesson.purchasedCourses;
  const remainedOnFreemium = statistics?.conversionAfterFreemiumLesson.remainedOnFreemium;

  const correctAnswers = statistics?.avgQuizScore.correctAnswerCount;
  const wrongAnswers = statistics?.avgQuizScore.wrongAnswerCount;
  const totalAnswers = statistics?.avgQuizScore.answerCount;

  const coursesCompletionChartConfig = {
    completed: {
      label: `Completed - ${totalCoursesCompletion}`,
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: `Enrolled - ${totalCourses}`,
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const coursesCompletionChartData = useMemo(
    () => [
      {
        state: "Completed",
        percentage: totalCoursesCompletion,
        fill: "var(--primary-700)",
      },
      {
        state: "Enrolled",
        percentage: totalCourses,
        fill: "var(--primary-300)",
      },
    ],
    [totalCoursesCompletion, totalCourses],
  );

  const conversionsChartConfig = {
    completed: {
      label: `Purchased Course - ${purchasedCourses}`,
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: `Remained on Freemium - ${remainedOnFreemium}`,
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const conversionsChartData = useMemo(
    () => [
      {
        state: "Purchased Course",
        percentage: purchasedCourses,
        fill: "var(--primary-700)",
      },
      {
        state: "Remained on Freemium",
        percentage: remainedOnFreemium,
        fill: "var(--primary-300)",
      },
    ],
    [purchasedCourses, remainedOnFreemium],
  );

  const avgQuizScoreChartConfig = {
    completed: {
      label: "Correct",
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: "Incorrect",
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const avgQuizScoreChartData = useMemo(
    () => [
      {
        state: "Correct",
        percentage: correctAnswers,
        fill: "var(--primary-700)",
      },
      {
        state: "Incorrect",
        percentage: wrongAnswers,
        fill: "var(--primary-300)",
      },
    ],
    [correctAnswers, wrongAnswers],
  );

  return (
    <PageWrapper className="flex flex-col gap-y-6 xl:gap-y-8 xl:!h-full 2xl:!h-auto">
      <div className="gap-x-2 flex xl:gap-x-4 items-center">
        <p className="h5 xl:h2 text-neutral-950">Welcome back, {user?.firstName}</p>
        <Avatar className="size-12">
          <Gravatar email={user?.email} />
        </Avatar>
      </div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-y-6 md:gap-x-4 xl:grid-cols-4 xl:grid-rows-2 xl:h-full">
        <FiveMostPopularCoursesChart
          data={statistics?.fiveMostPopularCourses}
          isLoading={isLoading}
        />
        <CourseCompletionPercentageChart
          isLoading={isLoading}
          label={`${statistics?.totalCoursesCompletionStats.completionPercentage}`}
          title="Course Completition Percentage"
          chartConfig={coursesCompletionChartConfig}
          chartData={coursesCompletionChartData}
        />
        <ConversionsAfterFreemiumLessonChart
          isLoading={isLoading}
          label={`${statistics?.conversionAfterFreemiumLesson.conversionPercentage}`}
          title="Conversions After Freemium Lesson"
          chartConfig={conversionsChartConfig}
          chartData={conversionsChartData}
        />
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 h-[400px] w-full xl:h-full"></div>
        <AvgScoreAcrossAllQuizzesChart
          isLoading={isLoading}
          label={`${correctAnswers}/${totalAnswers}`}
          title="Avg. Score Across All Quizzes"
          chartConfig={avgQuizScoreChartConfig}
          chartData={avgQuizScoreChartData}
        />
      </div>
    </PageWrapper>
  );
};
