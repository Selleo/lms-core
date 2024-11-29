import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import { CardBadge } from "~/components/CardBadge";
import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { GetLessonResponse } from "~/api/generated-api";

type OverviewProps = {
  lesson: GetLessonResponse["data"];
};

export default function Overview({ lesson }: OverviewProps) {
  const imageUrl = lesson.imageUrl ?? CardPlaceholder;
  const title = lesson.title;
  const description = lesson.description || "";
  const lessonItemsCount = lesson.itemsCount;
  const lessonItemsCompletedCount = lesson.itemsCompletedCount ?? 0;

  const isQuiz = lesson.type === "quiz";

  const isQuizSubmitted = lesson.type === "quiz" && lesson.isSubmitted;

  const renderQuizProgressBadge = () => {
    const badgeClasses = "absolute top-4 left-4 z-10";

    if (isQuizSubmitted) {
      return (
        <CardBadge variant="successOutlined" className={badgeClasses}>
          <Icon name="InputRoundedMarkerSuccess" />
          Completed
        </CardBadge>
      );
    }

    return (
      <CardBadge className={badgeClasses}>
        <Icon name="NotStartedRounded" />
        Not started
      </CardBadge>
    );
  };

  const quizBadge = renderQuizProgressBadge();

  return (
    <Card className="w-full pt-6 lg:pt-0 border-none drop-shadow-primary">
      <CardContent className="lg:p-8 flex flex-col align-center gap-6 2xl:flex-row">
        <div className="relative self-center w-full lg:max-w-[320px] aspect-video">
          {isQuiz && quizBadge}
          <img
            src={imageUrl}
            alt={title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover rounded-lg drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = CardPlaceholder;
            }}
          />
        </div>
        <div className="flex flex-col w-full">
          {!isQuiz && (
            <CourseProgress
              label="Lesson progress: "
              completedLessonCount={lessonItemsCompletedCount}
              courseLessonCount={lessonItemsCount}
            />
          )}
          {isQuizSubmitted && (
            <div className="bg-neutral-50 body-sm-md w-max mb-2 flex items-center gap-x-1 rounded-lg px-2 py-1">
              <Icon name="QuizStar" />
              <span>
                Your Score: {lesson.quizScore} / {lesson.lessonItems.length}
              </span>
            </div>
          )}
          <h5 className={cn("h5", { "mt-6": lesson.type !== "quiz" })}>{title}</h5>
          <Viewer content={description} className="body-base text-neutral-900" />
        </div>
      </CardContent>
    </Card>
  );
}
