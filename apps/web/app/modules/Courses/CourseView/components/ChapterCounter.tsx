import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";
import { formatNumberToTwoDigits } from "~/utils/formatNumberToTwoDigits";

import type { GetCourseResponse } from "~/api/generated-api";

type ChapterCounterProps = {
  chapterProgress: GetCourseResponse["data"]["chapters"][number]["chapterProgress"];
  displayOrder: GetCourseResponse["data"]["chapters"][number]["displayOrder"];
};

const chapterCounterIcon = {
  completed: "InputRoundedMarkerSuccess",
  in_progress: "InProgress",
  not_started: "NotStartedRounded",
} as const;

export const ChapterCounter = ({
  chapterProgress = "not_started",
  displayOrder,
}: ChapterCounterProps) => {
  const chapterNumber = formatNumberToTwoDigits(displayOrder);

  const isChapterCompleted = chapterProgress === "completed";
  const isChapterStarted = !isChapterCompleted && chapterProgress === "in_progress";

  return (
    <div
      className={cn(
        "sr-only after:block after:h-full after:w-0.5 md:not-sr-only md:flex md:flex-col md:items-center md:gap-y-1 md:pt-4",
        {
          "after:bg-secondary-200": isChapterStarted,
          "after:bg-primary-200": !isChapterStarted,
          "after:bg-success-200": isChapterCompleted,
        },
      )}
    >
      <div
        className={cn("relative aspect-square size-10 rounded-full", {
          "bg-secondary-50": isChapterStarted,
          "bg-primary-50": !isChapterStarted,
          "bg-success-50": isChapterCompleted,
        })}
      >
        {isChapterStarted ? (
          <Icon
            name={chapterCounterIcon[chapterProgress]}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <span className="body-base-md text-primary-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {chapterNumber}
          </span>
        )}
      </div>
    </div>
  );
};
