// TODO: Need to be fixed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Link } from "@remix-run/react";
import { cva } from "class-variance-authority";
import { startCase } from "lodash-es";

import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import { CardBadge } from "~/components/CardBadge";
import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { GetCourseResponse } from "~/api/generated-api";

type Chapter = GetCourseResponse["data"]["chapters"][number];

type ChapterStatus = "not_started" | "in_progress" | "completed";

type ChapterCardProps = Chapter & {
  index: number;
  isEnrolled: boolean;
  isAdmin: boolean;
  isFree?: boolean;
  customHref?: string;
};

const buttonVariants = cva("w-full transition", {
  defaultVariants: {
    variant: "not_started",
  },
  variants: {
    variant: {
      not_started: "border-primary-200 hover:border-primary-500",
      in_progress: "border-secondary-200 hover:border-secondary-500",
      completed: "border-success-500",
    },
  },
});

const getButtonProps = (chapterProgress: ChapterStatus, isAdmin: boolean, type?: string) => {
  if (isAdmin) {
    return { text: "Lesson preview", colorClass: "text-primary-700" };
  }

  if (chapterProgress === "completed") {
    return type === "quiz"
      ? { text: "Try again", colorClass: "text-success-600" }
      : { text: "Read more", colorClass: "text-success-600" };
  }

  if (chapterProgress === "in_progress") {
    return { text: "Continue", colorClass: "text-secondary-500" };
  }

  if (chapterProgress === "not_started" && type === "quiz") {
    return { text: "Start", colorClass: "text-primary-700" };
  }

  return { text: "Read more", colorClass: "text-primary-700" };
};

const cardBadgeIcon = {
  completed: "InputRoundedMarkerSuccess",
  in_progress: "InProgress",
  not_started: "NotStartedRounded",
} as const;

const cardBadgeVariant: Record<string, "successOutlined" | "secondary" | "default"> = {
  completed: "successOutlined",
  in_progress: "secondary",
  not_started: "default",
};

export const ChapterCard = ({
  description,
  imageUrl,
  index,
  isAdmin,
  isEnrolled,
  isFree = false,
  itemsCompletedCount,
  itemsCount,
  id: lessonId,
  chapterProgress = "not_started",
  title,
  type,
  customHref,
}: ChapterCardProps) => {
  const cardClasses = buttonVariants({
    className: cn({
      "opacity-60 cursor-not-allowed hover:border-primary-200": !isEnrolled && !isFree,
    }),
    variant: chapterProgress,
  });

  const { text: buttonText, colorClass: buttonColorClass } = getButtonProps(
    chapterProgress,
    isAdmin,
    type,
  );

  const hrefToLessonPage = customHref ?? `lesson/${lessonId}`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-4 h-full">
        <Link
          className={cn("flex flex-col h-full gap-4", {
            "cursor-not-allowed": !isEnrolled && !isFree,
          })}
          to={isEnrolled || isFree ? hrefToLessonPage : "#"}
          onClick={(e) => !isEnrolled && !isFree && e.preventDefault()}
          aria-disabled={!isEnrolled && !isFree}
        >
          <div className="relative">
            <img
              src={imageUrl ?? CardPlaceholder}
              alt={`Lesson ${index + 1}`}
              loading="eager"
              decoding="async"
              className="w-full object-cover object-center rounded-lg drop-shadow-sm aspect-video"
              onError={(e) => {
                (e.target as HTMLImageElement).src = CardPlaceholder;
              }}
            />
            {chapterProgress && (
              <CardBadge
                variant={cardBadgeVariant[chapterProgress]}
                className="absolute top-3 left-3"
              >
                <Icon name={cardBadgeIcon[chapterProgress]} />
                {startCase(chapterProgress)}
              </CardBadge>
            )}
            <span className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2 bg-white rounded-full w-8 h-8 flex justify-center items-center text-primary-700">
              {(index + 1).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center">
              <div className="flex flex-col h-full bg-white w-full">
                <CourseProgress
                  label={type === "quiz" ? "Quiz progress:" : "Lesson progress:"}
                  isCompleted={chapterProgress === "completed"}
                  completedLessonCount={itemsCompletedCount ?? 0}
                  courseLessonCount={itemsCount}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 pb-4">
              <h4 className="font-medium text-sm text-neutral-950 mt-2">{title}</h4>
              <Viewer
                content={description || ""}
                className="text-xs text-neutral-900 mt-1 line-clamp-3 flex-grow leading-5"
              />
            </div>
            <button
              className={cn("text-xs mt-auto inline-flex self-start font-medium", buttonColorClass)}
            >
              {/*TODO: Change icon*/}
              {buttonText} <Icon name="CarretDown" className="w-3 h-3 ml-1" />
            </button>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
