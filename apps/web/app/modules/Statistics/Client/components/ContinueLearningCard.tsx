import { Link } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useUserRole } from "~/hooks/useUserRole";
import { LessonCard } from "~/modules/Courses/CourseView/LessonCard";

import type { GetUserStatisticsResponse } from "~/api/generated-api";

type ContinueLearningCardProps = {
  isLoading: boolean;
  lesson: GetUserStatisticsResponse["data"]["lastLesson"] | undefined;
};

export const ContinueLearningCard = ({ isLoading = false, lesson }: ContinueLearningCardProps) => {
  const { isAdmin } = useUserRole();

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 gap-y-4 bg-white rounded-lg drop-shadow-card 2xl:max-w-[296px] flex flex-col">
        <div className="flex flex-col items-center gap-y-1">
          <Skeleton className="h-[29px] max-w-[240px] w-full rounded-lg" />
          <Skeleton className="h-4 max-w-[160px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="w-full h-auto items-center justify-between md:gap-8 2xl:flex-col 2xl:gap-y-4 p-8 gap-y-4 bg-white rounded-lg drop-shadow-card 2xl:max-w-[296px] flex flex-col">
        <div className="text-center md:w-fit 2xl:w-full">
          <h2 className="body-lg-md text-neutral-950">Currently have no lessons to continue.</h2>
        </div>
        <Icon name="NoData" />
        <Link to="/courses" className="w-full md:w-min 2xl:w-full">
          <Button className="w-full">Search courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-auto md:flex-row md:gap-8 2xl:flex-col 2xl:gap-y-4 p-4 gap-y-4 bg-white rounded-lg drop-shadow-card 2xl:max-w-[296px] flex flex-col">
      <div className="text-center md:w-fit 2xl:w-full">
        <h2 className="body-lg-md text-neutral-950">Continue learning in:</h2>
        <a href={`/course/${lesson?.courseId}`} className="body-sm-md text-primary-700 underline">
          {lesson?.courseTitle}
        </a>
        <p className="sr-only md:not-sr-only md:mt-6 md:body-base md:text-neutral-800 2xl:sr-only">
          {lesson?.courseDescription}
        </p>
      </div>
      <LessonCard
        {...lesson}
        customHref={`/course/${lesson.courseId}/lesson/${lesson.id}`}
        isAdmin={isAdmin}
        isEnrolled={!!lesson.enrolled}
        itemsCount={lesson.itemsCount}
        itemsCompletedCount={lesson.itemsCompletedCount}
        index={1}
      />
    </div>
  );
};
