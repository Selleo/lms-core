import { Button } from "~/components/ui/button";
import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";
import { useForm } from "react-hook-form";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import {
  type ClientLoaderFunctionArgs,
  Link,
  useParams,
} from "@remix-run/react";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import type { TQuestionsForm } from "./types";
import type { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";
import { allCoursesQueryOptions } from "~/api/queries/useCourses";
import { useCourseSuspense } from "~/api/queries/useCourse";

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
  const { data } = useLessonSuspense(lessonId ?? "");
  const {
    data: { lessons },
  } = useCourseSuspense(courseId ?? "");

  const lessonsIds = lessons.map((lesson) => lesson.id);
  const currentLessonIndex = lessonsIds.indexOf(lessonId ?? "");

  if (!data || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const { getValues, register } = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(data),
  });

  const orderedLessonsItems = getOrderedLessons(data);
  const questionsArray = getQuestionsArray(orderedLessonsItems);

  const previousLessonId =
    currentLessonIndex > 0 ? lessonsIds[currentLessonIndex - 1] : null;
  const nextLessonId =
    currentLessonIndex < lessonsIds.length - 1
      ? lessonsIds[currentLessonIndex + 1]
      : null;

  return (
    <>
      {orderedLessonsItems.map((lessonItem) => (
        <LessonItemsSwitch
          getValues={getValues}
          key={lessonItem.content.id}
          lessonItem={lessonItem}
          questionsArray={questionsArray}
          register={register}
        />
      ))}
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-end">
        <Link
          to={
            previousLessonId
              ? `/course/${courseId}/lesson/${previousLessonId}`
              : "#"
          }
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
    </>
  );
}
