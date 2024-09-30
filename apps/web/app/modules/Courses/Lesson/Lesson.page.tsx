import { useParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { Button } from "~/components/ui/button";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import type { TQuestionsForm } from "./types";
import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";

export default function LessonPage() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  if (!data || !lessonId) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const methods = useForm<TQuestionsForm>({
    mode: "onChange",
    defaultValues: getUserAnswers(data),
  });

  const orderedLessonsItems = getOrderedLessons(data);
  const questionsArray = getQuestionsArray(orderedLessonsItems);

  return (
    <FormProvider {...methods}>
      {orderedLessonsItems.map((lessonItem) => (
        <LessonItemsSwitch
          key={lessonItem.content.id}
          lessonItem={lessonItem}
          questionsArray={questionsArray}
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
    </FormProvider>
  );
}
