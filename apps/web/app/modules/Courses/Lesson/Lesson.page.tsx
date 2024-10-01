import { Button } from "~/components/ui/button";
import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";
import { useForm } from "react-hook-form";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { useParams } from "@remix-run/react";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import type { TQuestionsForm } from "./types";

export default function LessonPage() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  if (!data || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const { getValues, register } = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(data),
  });

  const orderedLessonsItems = getOrderedLessons(data);
  const questionsArray = getQuestionsArray(orderedLessonsItems);

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
      <div className="w-full flex gap-4 justify-end">
        <Button variant="outline" className="w-[180px]">
          Previous lesson
        </Button>
        <Button className="w-[180px]">Next lesson</Button>
      </div>
    </>
  );
}
