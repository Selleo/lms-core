import { type ClientLoaderFunctionArgs, Link, useParams } from "@remix-run/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useClearQuizProgress } from "~/api/mutations/useClearQuizProgress";
import { useSubmitQuiz } from "~/api/mutations/useSubmitQuiz";
import { useCourseSuspense } from "~/api/queries/useCourse";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import { queryClient } from "~/api/queryClient";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { LessonItems } from "~/modules/Courses/Lesson/LessonItems/LessonItems";
import { QuizSummaryModal } from "~/modules/Courses/Lesson/QuizSummaryModal";

import Breadcrumb from "./Breadcrumb";
import Overview from "./Overview";
import Summary from "./Summary";
import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";

import type { TQuestionsForm } from "./types";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { lessonId = "", courseId = "" } = params;
  if (!lessonId) throw new Error("Lesson ID not found");
  await queryClient.prefetchQuery(lessonQueryOptions(lessonId, courseId));
  return null;
};

export default function LessonPage() {
  const { lessonId = "", courseId = "" } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { data: lesson, refetch } = useLessonSuspense(lessonId, courseId);
  const {
    data: { id, title, lessons },
  } = useCourseSuspense(courseId ?? "");

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(lesson),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: async () => {
      await refetch();
      setIsOpen(true);
    },
  });
  const clearQuizProgress = useClearQuizProgress({
    handleOnSuccess: async () => {
      methods.reset();
      await refetch();
    },
  });

  const lessonsIds = lessons.map((lesson) => lesson.id);
  const currentLessonIndex = lessonsIds.indexOf(lessonId ?? "");

  if (!lesson || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const orderedLessonsItems = getOrderedLessons(lesson);

  const questionsArray = getQuestionsArray(orderedLessonsItems);

  const previousLessonId = currentLessonIndex > 0 ? lessonsIds[currentLessonIndex - 1] : null;
  const nextLessonId =
    currentLessonIndex < lessonsIds.length - 1 ? lessonsIds[currentLessonIndex + 1] : null;

  const isQuiz = lesson?.type === "quiz";
  const isEnrolled = lesson?.enrolled;

  const getScorePercentage = () => {
    if (!lesson.quizScore || lesson.quizScore === 0 || !lesson.lessonItems.length) return "0%";

    return `${((lesson.quizScore / lesson.lessonItems.length) * 100)?.toFixed(0)}%`;
  };

  const scorePercentage = getScorePercentage();

  const updateLessonItemCompletion = async () => {
    await refetch();
  };

  return (
    <div className="flex">
      <PageWrapper>
        <div className="flex flex-col gap-6 w-full">
          <Breadcrumb lessonData={lesson} courseId={id} courseTitle={title} />
          <Overview lesson={lesson} />
          {isQuiz && (
            <QuizSummaryModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              scoreLabel={scorePercentage}
              courseId={courseId}
            />
          )}
          <FormProvider {...methods}>
            <form className="flex flex-col gap-8">
              <LessonItems
                isSubmitted={!!lesson?.isSubmitted}
                questions={questionsArray}
                lessonItems={orderedLessonsItems}
                lessonType={lesson?.type ?? "multimedia"}
                updateLessonItemCompletion={updateLessonItemCompletion}
              />
            </form>
          </FormProvider>
          {isQuiz && (
            <Button
              className="w-min self-end"
              variant="outline"
              onClick={
                lesson?.isSubmitted
                  ? () => clearQuizProgress.mutate({ lessonId, courseId })
                  : () => submitQuiz.mutate({ lessonId, courseId })
              }
            >
              {lesson?.isSubmitted ? "Clear progress" : "Check answers"}
            </Button>
          )}
          {isEnrolled && (
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to={previousLessonId ? `/course/${courseId}/lesson/${previousLessonId}` : "#"}
                onClick={(e) => !previousLessonId && e.preventDefault()}
                reloadDocument
                replace
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-[180px]"
                  disabled={!previousLessonId}
                >
                  Previous lesson
                </Button>
              </Link>
              <Link
                to={nextLessonId ? `/course/${courseId}/lesson/${nextLessonId}` : "#"}
                onClick={(e) => !nextLessonId && e.preventDefault()}
                reloadDocument
                replace
              >
                <Button className="w-full sm:w-[180px]" disabled={!nextLessonId}>
                  Next lesson
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PageWrapper>
      <Summary lesson={lesson} />
    </div>
  );
}
