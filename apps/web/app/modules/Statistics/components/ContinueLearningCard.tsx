import { Skeleton } from "~/components/ui/skeleton";
import { LessonCard } from "~/modules/Courses/CourseView/LessonCard";

import type { GetUserStatisticsResponse } from "~/api/generated-api";

type ContinueLearningCardProps = {
  isLoading: boolean;
  lesson: GetUserStatisticsResponse["data"]["lastLesson"];
};

export const ContinueLearningCard = ({ isLoading = false, lesson }: ContinueLearningCardProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full p-4 gap-y-4 bg-white rounded-lg drop-shadow-card lg:max-w-[296px] flex flex-col">
        <div className="flex flex-col items-center gap-y-1">
          <Skeleton className="h-[29px] max-w-[240px] w-full rounded-lg" />
          <Skeleton className="h-[16px] max-w-[160px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 gap-y-4 bg-white rounded-lg drop-shadow-card lg:max-w-[296px] flex flex-col">
      <div className="text-center">
        <h2 className="body-lg-md text-neutral-950">Continue learning in:</h2>
        <a href="#" className="body-sm-md text-primary-700 underline">
          Introduction to Cloud Computing
        </a>
      </div>
      <LessonCard
        {...lesson}
        isEnrolled={lesson?.enrolled}
        itemsCount={lesson?.itemsCount}
        itemsCompletedCount={lesson?.itemsCompletedCount}
        index={1}
      />
    </div>
  );
};
