import { useMemo } from "react";

import { useCurrentUser, useTeacherStatistics } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";

import { CourseCompletionPercentageChart, FiveMostPopularCoursesChart } from "./components";

import type { ChartConfig } from "~/components/ui/chart";

export const AdminStatistics = () => {
  const { data: user } = useCurrentUser();
  const { data: statistics, isLoading } = useTeacherStatistics();

  const totalCoursesCompletion = statistics?.totalCoursesCompletionStats.totalCoursesCompletion;
  const totalCourses = statistics?.totalCoursesCompletionStats.totalCourses;

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

  return (
    <PageWrapper className="flex flex-col gap-y-6 xl:gap-y-8 xl:!h-full">
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
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-1 xl:col-span-1 w-full h-[400px] xl:h-full"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-1 h-[400px] xl:col-span-2 w-full md:h-full"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 w-full h-[447px] xl:h-full"></div>
      </div>
    </PageWrapper>
  );
};
