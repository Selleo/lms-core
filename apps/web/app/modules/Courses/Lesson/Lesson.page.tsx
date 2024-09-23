import { ClientLoaderFunctionArgs, useParams } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";
import { getOrderedLessons } from "./Summary/utils";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";

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

  if (!data) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const orderedLessonsItems = getOrderedLessons(data);

  return (
    <>
      {orderedLessonsItems.map((lessonItem) => (
        <LessonItemsSwitch
          key={lessonItem.content.id}
          lessonItem={lessonItem}
        />
      ))}
    </>
  );
}
