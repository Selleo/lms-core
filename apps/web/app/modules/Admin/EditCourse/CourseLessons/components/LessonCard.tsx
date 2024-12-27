import { useMemo } from "react";

import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";

import { mapItemType, mapTypeToIcon } from "../CourseLessons.helpers";

import type { ReactNode } from "react";
import { LessonType, type Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";
import type { IconName } from "~/types/shared";

interface LessonCardProps {
  item: Lesson;
  onClickLessonCard: (lesson: Lesson) => void;
  dragTrigger: ReactNode;
  selectedLesson: Lesson | null;
}

const LessonCard = ({ item, onClickLessonCard, dragTrigger, selectedLesson }: LessonCardProps) => {
  const contentType = item.type === "file" ? item.fileType : item.type;

  const mappedItemType = useMemo(() => mapItemType(contentType), [contentType]);
  const getIcon = useMemo(() => mapTypeToIcon(contentType as string), [contentType]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onClickLessonCard(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick({} as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      key={item.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lesson: ${item.title}`}
      className={cn(
        "flex p-3 gap-x-3 bg-white border rounded-lg hover:border-neutral-300 hover:bg-neutral-50",
        {
          "border-neutral-200": selectedLesson?.id !== item.id,
          "border-primary-500 bg-primary-50": selectedLesson?.id === item.id,
        },
      )}
    >
      {dragTrigger}
      <div className="flex gap-x-2 items-start">
        <Icon name={getIcon as IconName} className="size-6 text-primary-700" />
        <hgroup>
          <p className="text-l">
            {item.type === LessonType.QUIZ ? (
              <>
                {item.title}{" "}
                <span className="text-neutral-600">({item.questions?.length || 0})</span>
              </>
            ) : (
              item.title
            )}
          </p>
          <p className="text-neutral-600 details">{mappedItemType}</p>
        </hgroup>
      </div>
    </div>
  );
};

export default LessonCard;
