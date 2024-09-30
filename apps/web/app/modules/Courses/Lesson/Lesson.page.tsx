import { useParams } from "@remix-run/react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { getOrderedLessons, getQuestionsArray, getUserAnswers } from "./utils";
import LessonItemsSwitch from "./LessonItems/LessonItemsSwitch";
import type { TQuestionsForm } from "./types";

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
        <Button className="bg-neutral-200">
          <div className="body-sm-md text-primary-800 px-4">
            Previous lesson
          </div>
        </Button>
        <Button>
          <div className="body-sm-md text-white px-4">Next lesson</div>
        </Button>
      </div>
    </FormProvider>
  );
}
