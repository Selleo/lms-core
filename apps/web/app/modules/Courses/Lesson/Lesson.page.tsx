import { ClientLoaderFunctionArgs, useParams } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";
import { getOrderedLessons, getQuestionsArray } from "./utils";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import type { TQuestionsForm } from "./types";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }, { name: "description", content: "lesson" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const courseId = params.courseId;
  const lessonId = params.lessonId;
  courseId && (await queryClient.prefetchQuery(courseQueryOptions(courseId)));
  lessonId && (await queryClient.prefetchQuery(lessonQueryOptions(lessonId)));
  return null;
};

export default function LessonPage() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  if (!data || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const { register } = useForm<TQuestionsForm>({
    mode: "onChange",
  });

  const orderedLessonsItems = getOrderedLessons(data);
  const questionsArray = getQuestionsArray(orderedLessonsItems);

  return (
    <>
      {orderedLessonsItems.map((lessonItem) => (
        <LessonItemsSwitch
          key={lessonItem.content.id}
          lessonItem={lessonItem}
          questionsArray={questionsArray}
          register={register}
        />
      ))}
      <div className="w-full flex gap-4 justify-end">
        <Button variant="outline" className="w-[180px]">
          Previous lesson
        </Button>
        <Button className="w-[180px]">
          Next lesson
        </Button>
      </div>
    </>
  );
}
