import { GetLessonResponse } from "~/api/generated-api";

export const getSummaryItems = (lesson: GetLessonResponse["data"]) => {
  const lessonItems = lesson.lessonItems;

  return lessonItems
    .map((lessonItem) => {
      const isQuestionTpe = lessonItem.lessonItemType === "question";
      return {
        title: isQuestionTpe
          ? lessonItem.content.questionBody
          : lessonItem.content.title,
        displayOrder: lessonItem.displayOrder,
        id: lessonItem.content.id,
      };
    })
    .sort((a, b) => a.displayOrder || 0 - b.displayOrder || 0);
};
