import { GetLessonResponse } from "~/api/generated-api";

export const getSummaryItems = (lesson: GetLessonResponse["data"]) => {
  const lessonItems = lesson.lessonItems;

  return lessonItems
    .map((lessonItem) => {
      if ("title" in lessonItem.content) {
        return {
          title: lessonItem.content.title,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.content.id,
        };
      } else {
        return {
          title: lessonItem.content.questionBody,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.content.id,
        };
      }
    })
    .sort((a, b) => a.displayOrder || 0 - (b.displayOrder || 0));
};
