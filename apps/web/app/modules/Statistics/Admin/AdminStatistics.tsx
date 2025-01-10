import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentUser, useTeacherStatistics } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";
import { AvgScoreAcrossAllQuizzesChart } from "~/modules/Statistics/Admin/components/AvgScoreAcrossAllQuizzessChart";
import { ConversionsAfterFreemiumLessonChart } from "~/modules/Statistics/Admin/components/ConversionsAfterFreemiumLessonChart";
import { EnrollmentChart } from "~/modules/Statistics/Admin/components/EnrollmentChart";

import { CourseCompletionPercentageChart, FiveMostPopularCoursesChart } from "./components";

import type { ChartConfig } from "~/components/ui/chart";

export const AdminStatistics = () => {
  const { data: user } = useCurrentUser();
  const { data: statistics, isLoading } = useTeacherStatistics();
  const { t } = useTranslation();
  const totalCoursesCompletion =
    statistics?.totalCoursesCompletionStats.totalCoursesCompletion ?? 0;
  const totalCourses = statistics?.totalCoursesCompletionStats.totalCourses ?? 0;

  const purchasedCourses = statistics?.conversionAfterFreemiumLesson.purchasedCourses ?? 0;
  const remainedOnFreemium = statistics?.conversionAfterFreemiumLesson.remainedOnFreemium ?? 0;

  const correctAnswers = statistics?.avgQuizScore.correctAnswerCount ?? 0;
  const totalAnswers = statistics?.avgQuizScore.answerCount ?? 0;

  const coursesCompletionChartConfig = {
    completed: {
      label: `${t("adminStatisticsView.other.completed")} - ${totalCoursesCompletion}`,
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: `${t("adminStatisticsView.other.enrolled")} - ${totalCourses}`,
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const coursesCompletionChartData = useMemo(
    () => [
      {
        state: t("adminStatisticsView.other.completed"),
        percentage: totalCoursesCompletion,
        fill: "var(--primary-700)",
      },
      {
        state: t("adminStatisticsView.other.enrolled"),
        percentage: totalCourses,
        fill: "var(--primary-300)",
      },
    ],
    [totalCoursesCompletion, totalCourses],
  );

  const conversionsChartConfig = {
    completed: {
      label: `${t("adminStatisticsView.other.purchasedCourse")} - ${purchasedCourses}`,
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: `${t("adminStatisticsView.other.remainedOnFreemium")} - ${remainedOnFreemium}`,
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const conversionsChartData = useMemo(
    () => [
      {
        state: t("adminStatisticsView.other.purchasedCourse"),
        percentage: purchasedCourses,
        fill: "var(--primary-700)",
      },
      {
        state: t("adminStatisticsView.other.remainedOnFreemium"),
        percentage: remainedOnFreemium,
        fill: "var(--primary-300)",
      },
    ],
    [purchasedCourses, remainedOnFreemium],
  );

  const avgQuizScoreChartConfig = {
    completed: {
      label: t("adminStatisticsView.other.correct"),
      color: "var(--primary-700)",
    },
    notCompleted: {
      label: t("adminStatisticsView.other.incorrect"),
      color: "var(--primary-300)",
    },
  } satisfies ChartConfig;

  const avgQuizScoreChartData = useMemo(
    () => [
      {
        state: t("adminStatisticsView.other.correct"),
        percentage: 7,
        fill: "var(--primary-700)",
      },
      {
        state: t("adminStatisticsView.other.incorrect"),
        percentage: 13,
        fill: "var(--primary-300)",
      },
    ],
    [],
  );

  return (
    <PageWrapper className="flex flex-col gap-y-6 xl:gap-y-8 xl:!h-full 2xl:!h-auto">
      <div className="gap-x-2 flex xl:gap-x-4 items-center">
        <p className="h5 xl:h2 text-neutral-950">
          {t("adminStatisticsView.header")} {user?.firstName}
        </p>
        <Avatar className="size-12">
          <Gravatar email={user?.email} />
        </Avatar>
      </div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-y-6 md:gap-x-4 xl:grid-cols-4 xl:grid-rows-[minmax(min-content,_auto)] xl:h-full">
        <FiveMostPopularCoursesChart
          data={statistics?.fiveMostPopularCourses}
          isLoading={isLoading}
        />
        <CourseCompletionPercentageChart
          isLoading={isLoading}
          label={`${statistics?.totalCoursesCompletionStats.completionPercentage}`}
          title={t("adminStatisticsView.other.courseCompletitionPercentage")}
          chartConfig={coursesCompletionChartConfig}
          chartData={coursesCompletionChartData}
        />
        <ConversionsAfterFreemiumLessonChart
          isLoading={isLoading}
          label={`${statistics?.conversionAfterFreemiumLesson.conversionPercentage}`}
          title={t("adminStatisticsView.other.conversionsAfterFreemiumLessson")}
          chartConfig={conversionsChartConfig}
          chartData={conversionsChartData}
        />
        <EnrollmentChart isLoading={isLoading} data={statistics?.courseStudentsStats} />
        <AvgScoreAcrossAllQuizzesChart
          isLoading={isLoading}
          label={`${correctAnswers}/${totalAnswers}`}
          title={t("adminStatisticsView.other.avgQuizScore")}
          chartConfig={avgQuizScoreChartConfig}
          chartData={avgQuizScoreChartData}
        />
      </div>
    </PageWrapper>
  );
};
