import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Link } from "@remix-run/react";
import CourseProgress from "~/components/CourseProgress";
import { CaretRight } from "~/assets/svgs";
import type { GetCourseResponse } from "~/api/generated-api";

type Lesson = GetCourseResponse["data"]["lessons"][number];

type LessonCardProps = Lesson & {
  index: number;
  isEnrolled: boolean;
  isAdmin: boolean;
  type: string;
};

export const LessonCard = ({
  id: lessonId,
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
  return (
    <Card
      key={index}
      className={cn("w-full transition border-primary-200", {
        "hover:border-primary-500": isEnrolled,
        "opacity-60 cursor-not-allowed": !isEnrolled,
      })}
    >
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
            <span className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2 bg-white rounded-full w-8 h-8 flex justify-center items-center text-primary-700">
              {(index + 1).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center">
              <div className="flex flex-col h-full bg-white w-full">
                <CourseProgress
                  label={
                    type === "quiz" ? "Quiz progress:" : "Lesson progress:"
                  }
                  completedLessonCount={itemsCompletedCount ?? 0}
                  courseLessonCount={itemsCount}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 pb-4">
              <h4 className="font-medium text-sm text-neutral-950 mt-2">
                {title}
              </h4>
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
                  Read more{" "}
                  <CaretRight className="w-3 h-3 inline-block text-primary-700" />
                </>
              ) : null}
            </Link>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
