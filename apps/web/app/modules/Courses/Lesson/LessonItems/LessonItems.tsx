import { LessonItem } from "./LessonItem";

import type { GetLessonResponse } from "~/api/generated-api";

type LessonItemsProps = {
  lessonItems: GetLessonResponse["data"]["lessonItems"];
  isSubmitted: boolean;
  questions: string[];
  lessonType: string;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export const LessonItems = ({
  lessonItems,
  questions,
  isSubmitted,
  lessonType,
  updateLessonItemCompletion,
}: LessonItemsProps) => {
  return lessonItems.map((lessonItem, index) => {
    return (
      <LessonItem
        isSubmitted={isSubmitted}
        key={index}
        lessonItem={lessonItem}
        questionsArray={questions}
        lessonType={lessonType}
        updateLessonItemCompletion={updateLessonItemCompletion}
      />
    );
  });
};
