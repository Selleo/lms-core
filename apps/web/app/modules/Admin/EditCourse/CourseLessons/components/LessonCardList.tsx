import { useCallback, useEffect, useState } from "react";

import { useChangeLessonDisplayOrder } from "~/api/mutations/admin/changeLessonDisplayOrder";
import { Icon } from "~/components/Icon";
import { SortableList } from "~/components/SortableList/SortableList";
import LessonCard from "~/modules/Admin/EditCourse/CourseLessons/components/LessonCard";
import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import type { Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";

type LessonCardListProps = {
  setSelectedLesson: (lesson: Lesson) => void;
  setContentTypeToDisplay: (contentType: string) => void;
  lessons: Lesson[];
  selectedLesson?: Lesson;
};

export const LessonCardList = ({
  lessons,
  setSelectedLesson,
  setContentTypeToDisplay,
  selectedLesson,
}: LessonCardListProps) => {
  const [items, setItems] = useState(lessons);
  const mutation = useChangeLessonDisplayOrder();

  useEffect(() => {
    setItems(lessons);
  }, [lessons]);

  const onClickLessonCard = useCallback(
    (lesson: Lesson) => {
      const contentType = lesson.type === "file" ? lesson.fileType : lesson.type;

      setSelectedLesson(lesson);

      switch (contentType) {
        case "video":
          setContentTypeToDisplay(ContentTypes.VIDEO_LESSON_FORM);
          break;
        case "text":
          setContentTypeToDisplay(ContentTypes.TEXT_LESSON_FORM);
          break;
        case "presentation":
          setContentTypeToDisplay(ContentTypes.PRESENTATION_FORM);
          break;
        case "quiz":
          setContentTypeToDisplay(ContentTypes.QUIZ_FORM);
          break;
        default:
          setContentTypeToDisplay(ContentTypes.EMPTY);
      }
    },
    [setContentTypeToDisplay, setSelectedLesson],
  );

  if (!lessons) {
    return <p>No items for this lesson</p>;
  }

  return (
    <SortableList
      items={items}
      onChange={async (updatedItems, newChapterPosition, newDisplayOrder) => {
        setItems(updatedItems);

        await mutation.mutateAsync({
          lesson: { lessonId: updatedItems[newChapterPosition].id, displayOrder: newDisplayOrder },
        });
      }}
      className="mt-4 grid grid-cols-1 gap-4"
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          <LessonCard
            key={item.id}
            item={item}
            onClickLessonCard={onClickLessonCard}
            selectedLesson={selectedLesson}
            dragTrigger={
              <SortableList.DragHandle>
                <Icon name="DragAndDropIcon" className="cursor-move" />
              </SortableList.DragHandle>
            }
          />
        </SortableList.Item>
      )}
    />
  );
};
