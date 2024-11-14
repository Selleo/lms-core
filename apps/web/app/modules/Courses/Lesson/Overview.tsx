import { useParams } from "@remix-run/react";

import { useLessonSuspense } from "~/api/queries/useLesson";
import { CardBadge } from "~/components/CardBadge";
import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export default function Overview() {
  const { lessonId = "", courseId = "" } = useParams();
  const { data } = useLessonSuspense(lessonId, courseId);

  const imageUrl = data.imageUrl ?? CardPlaceholder;
  const title = data.title;
  const description = data.description;
  const lessonItemsCount = data.itemsCount;
  const lessonItemsCompletedCount = data.itemsCompletedCount ?? 0;

  const isQuiz = data.type === "quiz";

  const isQuizSubmitted = data.type === "quiz" && data.isSubmitted;

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
                Your Score: {data.quizScore} / {data.lessonItems.length}
              </span>
            </div>
          )}
          <h5 className={cn("h5", { "mt-6": data.type !== "quiz" })}>{title}</h5>
          <Viewer content={description} className="body-base text-neutral-900" />
        </div>
      </CardContent>
    </Card>
  );
}
