import { useMemo } from "react";

import { Icon } from "~/components/Icon";

import { mapItemType, mapTypeToIcon } from "../CourseLessons.helpers";

import type { LessonItem } from "../../EditCourse.types";
import type { IconName } from "~/types/shared";

interface LessonCardProps {
  item: LessonItem;
  onClickLessonCard: (lesson: LessonItem) => void;
}

const LessonCard = ({ item, onClickLessonCard }: LessonCardProps) => {
  const contentType = item.lessonItemType === "file" ? item.content.type : item.lessonItemType;

  const mappedItemType = useMemo(() => mapItemType(contentType as string), [contentType]);
  const getIcon = useMemo(() => mapTypeToIcon(contentType as string), [contentType]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClickLessonCard(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick({} as React.MouseEvent);
    }
  };
  return (
    <div
      key={item.content.id}
      className="h-auto p-4 shadow-sm border border-gray-300 bg-white rounded-md cursor-pointer"
      draggable
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lesson: ${item.content.title}`}
    >
      <div className="flex w-full">
        <div className="w-1/10 flex">
          <Icon name="DragAndDropIcon" className="cursor-move" />
        </div>
        <div className="flex-1 flex flex-col justify-between ml-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name={getIcon as IconName} className="mr-2" />
              <p className="text-l">{item.content.title}</p>
            </div>
            {item?.content.state === "draft" && (
              <span className="ml-2 flex items-center text-yellow-600 bg-[#FEFDE8] px-2 py-1 rounded-sm text-sm">
                <Icon name="Warning" className="mr-1" />
                Draft
              </span>
            )}
          </div>
          <p className="text-m ml-8 text-gray-500 mt-2">{mappedItemType}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
