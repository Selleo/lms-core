import { useClearQuizProgress } from "~/api/mutations/useClearQuizProgress";
import { lessonQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import CourseNotStartedImage from "~/assets/course-not-started.png";
import CourseStartedImage from "~/assets/course-started.png";
import { Button } from "~/components/ui/button";

import type { GetLessonResponse } from "~/api/generated-api";

type QuizSummaryProps = {
  lessonId: string;
  courseId: string;
  data: GetLessonResponse["data"];
};

export const QuizSummary = ({ lessonId, courseId, data }: QuizSummaryProps) => {
  const clearQuizProgress = useClearQuizProgress({
    handleOnSuccess: async () => {
      await queryClient.invalidateQueries(lessonQueryOptions(lessonId, courseId));
    },
  });

  const { isSubmitted, quizScore, itemsCount } = data || {};

  return (
    <div className="flex flex-col gap-y-4 p-6 bg-white">
      <div className="w-full bg-neutral-50 rounded-lg flex justify-center">
        <img
          src={isSubmitted ? CourseStartedImage : CourseNotStartedImage}
          alt=""
          className="w-[220px] h-auto aspect-square"
        />
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <hgroup className="text-center">
          <h2 className="font-bold text-lg text-neutral-950">
            {isSubmitted ? "Your Latest Attempt" : "You haven’t finished this quiz yet."}
          </h2>
          {!isSubmitted ? (
            <p className="body-base">
              Once you complete the quiz, your score will appear here. You’ll also have the option
              to retake it anytime to improve your results.
            </p>
          ) : (
            <p className="body-base text-neutral-800">
              You completed the quiz with a score of {quizScore} / {itemsCount}.
            </p>
          )}
        </hgroup>
        {isSubmitted && (
          <div className="flex flex-col gap-y-3">
            <Button
              onClick={() =>
                clearQuizProgress.mutate({
                  lessonId: lessonId,
                  courseId: courseId,
                })
              }
            >
              Try Again
            </Button>
            <span className="text-center text-neutral-800 body-sm">
              Clicking Try Again will erase your latest score. This action cannot be undone.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
