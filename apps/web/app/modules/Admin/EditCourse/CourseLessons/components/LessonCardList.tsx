import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useChangeLessonDisplayOrder } from "~/api/mutations/admin/changeLessonDisplayOrder";
import { Icon } from "~/components/Icon";
import { SortableList } from "~/components/SortableList/SortableList";
import { useLeaveModal } from "~/context/LeaveModalContext";
import LessonCard from "~/modules/Admin/EditCourse/CourseLessons/components/LessonCard";
import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import type { Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";

type DraggableLesson = Lesson & { sortableId: string };

type LessonCardListProps = {
  setSelectedLesson: (lesson: Lesson) => void;
  setContentTypeToDisplay: (contentType: string) => void;
  lessons: DraggableLesson[];
  selectedLesson: Lesson | null;
};

export const LessonCardList = ({
  lessons,
  setSelectedLesson,
  setContentTypeToDisplay,
  selectedLesson,
}: LessonCardListProps) => {
  const [items, setItems] = useState(lessons);
  const mutation = useChangeLessonDisplayOrder();
  const { openLeaveModal, isCurrentFormDirty, setIsLeavingContent } = useLeaveModal();
  const [pendingLesson, setPendingLesson] = useState<Lesson | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setItems(lessons);
  }, [lessons]);

  const onClickLessonCard = useCallback(
    (lesson: Lesson) => {
      if (isCurrentFormDirty) {
        setPendingLesson(lesson);
        setIsLeavingContent(true);
        openLeaveModal();
        return;
      }

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
    [
      isCurrentFormDirty,
      setContentTypeToDisplay,
      setSelectedLesson,
      openLeaveModal,
      setIsLeavingContent,
    ],
  );

  useEffect(() => {
    if (!isCurrentFormDirty && pendingLesson) {
      onClickLessonCard(pendingLesson);
      setPendingLesson(null);
      setIsLeavingContent(false);
    }
  }, [isCurrentFormDirty, pendingLesson, onClickLessonCard, setIsLeavingContent]);

  if (!lessons) {
    return <p>{t("lessonEmptyState")}</p>;
  }

  return (
    <SortableList
      items={items}
      onChange={async (updatedItems, newChapterPosition, newDisplayOrder) => {
        setItems(updatedItems);

        await mutation.mutateAsync({
          lesson: {
            lessonId: updatedItems[newChapterPosition].sortableId,
            displayOrder: newDisplayOrder,
          },
        });
      }}
      className="mt-4 grid grid-cols-1 gap-4"
      renderItem={(item) => (
        <SortableList.Item id={item.sortableId}>
          <LessonCard
            key={item.sortableId}
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
