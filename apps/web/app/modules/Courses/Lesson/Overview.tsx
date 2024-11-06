import { useParams } from "@remix-run/react";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { Card, CardContent } from "~/components/ui/card";
import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";
import CourseProgress from "~/components/CourseProgress";

export default function Overview() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  const imageUrl = data.imageUrl ?? "https://placehold.co/320x180";
  const title = data.title;
  const description = data.description;
  const lessonItemsCount = data.itemsCount;
  const lessonItemsCompletedCount = data.itemsCompletedCount ?? 0;

  const isQuiz = data.type === "quiz";

  const isQuizSubmitted = data.type === "quiz" && data.isSubmitted;

  const renderQuizProgressBadge = () => {
    if (isQuizSubmitted) {
      return (
        <>
          <Icon name="InputRoundedMarkerSuccess" />
          <span className="text-success-800">Completed</span>
        </>
      );
    }

    return (
      <>
        <Icon name="NotStartedRounded" />
        <span className="text-neutral-900">Not started</span>
      </>
    );
  };

  const quizBadge = renderQuizProgressBadge();

  return (
    <Card className="w-full pt-6 lg:pt-0 border-none drop-shadow-primary">
      <CardContent className="lg:p-8 flex flex-col align-center gap-6 2xl:flex-row">
        <div className="relative self-center w-full lg:max-w-[320px] aspect-video">
          {isQuiz && (
            <div className="absolute z-10 flex items-center body-sm-md px-2 gap-x-1 rounded-lg py-1 left-4 top-4 bg-white">
              {quizBadge}
            </div>
          )}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg drop-shadow-sm"
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
          <h5 className={cn("h5", { "mt-6": data.type !== "quiz" })}>
            {title}
          </h5>
          <div className="body-base">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}
