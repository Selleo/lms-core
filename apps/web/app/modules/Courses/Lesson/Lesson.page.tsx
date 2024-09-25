import { ClientLoaderFunctionArgs, useParams } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { lessonQueryOptions, useLessonSuspense } from "~/api/queries/useLesson";
import { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";
import { getOrderedLessons } from "./Summary/utils";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import type { TQuestionsForm } from "./types";
import { normalizedQuestionsData } from "./utils";

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

  const { register, handleSubmit } = useForm<TQuestionsForm>({
    mode: "onChange",
  });

  const onSubmit = async (values: TQuestionsForm) => {
    console.log({ values });
    const data = normalizedQuestionsData(values, lessonId);
    console.log({ data });
  };

  const orderedLessonsItems = getOrderedLessons(data);

  return (
    <>
      {orderedLessonsItems.map((lessonItem) => (
        <LessonItemsSwitch
          key={lessonItem.content.id}
          lessonItem={lessonItem}
          register={register}
        />
      ))}
      <div className="w-full flex gap-4 justify-end">
        <Button className="bg-neutral-200" onClick={handleSubmit(onSubmit)}>
          <div className="body-sm-md text-primary-800 px-4">
            Previous lesson
          </div>
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>
          <div className="body-sm-md text-white px-4">Next lesson</div>
        </Button>
      </div>
    </>
  );
}
