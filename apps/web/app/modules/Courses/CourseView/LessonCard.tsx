import { Link } from "@remix-run/react";
import { cva } from "class-variance-authority";
import { startCase } from "lodash-es";

import { CaretRight } from "~/assets/svgs";
import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { GetCourseResponse } from "~/api/generated-api";

type Lesson = GetCourseResponse["data"]["lessons"][number];

type LessonStatus = "not_started" | "in_progress" | "completed";

type LessonCardProps = Lesson & {
  index: number;
  isEnrolled: boolean;
  isAdmin: boolean;
  type?: string;
  lessonProgress?: LessonStatus;
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

const cardBadgeLabelVariants = cva("details-md", {
  defaultVariants: {
    variant: "not_started",
  },
  variants: {
    variant: {
      not_started: "text-neutral-900",
      in_progress: "text-secondary-700",
      completed: "text-success-800",
    },
  },
});

export const LessonCard = ({
  id: lessonId,
  lessonProgress = "not_started",
  index,
  isEnrolled,
  imageUrl,
  itemsCompletedCount,
  itemsCount,
  title,
  type,
  description,
  isAdmin,
}: LessonCardProps) => {
  const cardClasses = buttonVariants({
    className: cn({
      "opacity-60 cursor-not-allowed": !isEnrolled,
    }),
    variant: lessonProgress,
  });

  const cardBadgeIcon = {
    completed: "InputRoundedMarkerSuccess",
    in_progress: "InProgress",
    not_started: "NotStartedRounded",
  } as const;

  return (
    <Card key={index} className={cardClasses}>
      <CardContent className="p-4 h-full">
        <Link
          className={cn("flex flex-col h-full gap-4", {
            "cursor-not-allowed": !isEnrolled,
          })}
          to={isEnrolled ? `lesson/${lessonId}` : "#"}
          onClick={(e) => !isEnrolled && e.preventDefault()}
          aria-disabled={!isEnrolled}
        >
          <div className="relative">
            <img
              src={imageUrl ?? "https://placehold.co/600x400"}
              alt={`Lesson ${index + 1}`}
              className="w-full object-cover object-center rounded-lg drop-shadow-sm aspect-video"
            />
            {lessonProgress && (
              <div className="flex items-center absolute gap-x-1 py-0.5 px-1 left-3 top-3 bg-white rounded-lg">
                <Icon name={cardBadgeIcon[lessonProgress]} />
                <span
                  className={cardBadgeLabelVariants({
                    variant: lessonProgress,
                  })}
                >
                  {startCase(lessonProgress)}
                </span>
              </div>
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
                  isCompleted={lessonProgress === "completed"}
                  completedLessonCount={itemsCompletedCount ?? 0}
                  courseLessonCount={itemsCount}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 pb-4">
              <h4 className="font-medium text-sm text-neutral-950 mt-2">{title}</h4>
              <p className="text-xs text-neutral-900 mt-1 line-clamp-3 flex-grow leading-5">
                {description}
              </p>
            </div>
            <Link
              to={`lesson/${lessonId}`}
              className="text-primary-700 text-xs mt-auto self-start font-medium"
            >
              {isAdmin ? (
                "Lesson preview"
              ) : isEnrolled ? (
                <>
                  Read more <CaretRight className="w-3 h-3 inline-block text-primary-700" />
                </>
              ) : null}
            </Link>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
