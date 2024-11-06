import { type ClientLoaderFunctionArgs, Link, useParams } from "@remix-run/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useClearQuizProgress } from "~/api/mutations/useClearQuizProgress";
import { useSubmitQuiz } from "~/api/mutations/useSubmitQuiz";
import { useCourseSuspense } from "~/api/queries/useCourse";
import { allCoursesQueryOptions } from "~/api/queries/useCourses";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { LessonItems } from "~/modules/Courses/Lesson/LessonItems/LessonItems";
import { QuizSummaryModal } from "~/modules/Courses/Lesson/QuizSummaryModal";

import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";

import type { TQuestionsForm } from "./types";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { lessonId } = params;
  if (!lessonId) throw new Error("Lesson ID not found");
  await queryClient.prefetchQuery(allCoursesQueryOptions());
  await queryClient.prefetchQuery(lessonQueryOptions(lessonId));
  return null;
};

export default function LessonPage() {
  const { lessonId, courseId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useLessonSuspense(lessonId);
  const {
    data: { lessons },
  } = useCourseSuspense(courseId ?? "");

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(data),
  });

  const submitQuiz = useSubmitQuiz({
    handleOnSuccess: () => {
      refetch();
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

  if (!data || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const orderedLessonsItems = getOrderedLessons(data);

  const questionsArray = getQuestionsArray(orderedLessonsItems);

  const previousLessonId = currentLessonIndex > 0 ? lessonsIds[currentLessonIndex - 1] : null;
  const nextLessonId =
    currentLessonIndex < lessonsIds.length - 1 ? lessonsIds[currentLessonIndex + 1] : null;

  const isQuiz = data?.type === "quiz";

  const getScorePercentage = () => {
    if (!data.quizScore || data.quizScore === 0 || !data.lessonItems.length) return "0%";

    return `${((data.quizScore / data.lessonItems.length) * 100)?.toFixed(0)}%`;
  };

  const scorePercentage = getScorePercentage();

  return (
    <>
      {isQuiz && (
        <QuizSummaryModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          scoreLabel={scorePercentage}
          courseId={courseId ?? ""}
        />
      )}
      <FormProvider {...methods}>
        <form className="flex flex-col gap-8">
          <LessonItems
            isSubmitted={!!data?.isSubmitted}
            questions={questionsArray}
            lessonItems={orderedLessonsItems}
          />
        </form>
      </FormProvider>
      {isQuiz && (
        <Button
          className="w-min self-end"
          variant="outline"
          onClick={
            data?.isSubmitted
              ? () => clearQuizProgress.mutate({ lessonId })
              : () => submitQuiz.mutate({ lessonId })
          }
        >
          {data?.isSubmitted ? "Clear progress" : "Check answers"}
        </Button>
      )}
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-end">
        <Link
          to={previousLessonId ? `/course/${courseId}/lesson/${previousLessonId}` : "#"}
          onClick={(e) => !previousLessonId && e.preventDefault()}
          reloadDocument
          replace
        >
          <Button variant="outline" className="w-full sm:w-[180px]" disabled={!previousLessonId}>
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
    </>
  );
}
