import { Icon } from "~/components/Icon";

import { mapItemType, mapTypeToIcon } from "../CourseLessons.helpers";

import type { LessonItem } from "../../EditCourse.types";
import type { IconName } from "~/types/shared";

interface LessonCardProps {
  item: LessonItem;
}

const LessonCard = ({ item }: LessonCardProps) => {
  const mappedItemType = mapItemType(item.lessonItemType);
  const getIcon = mapTypeToIcon(item.lessonItemType);
  return (
    <div
      key={item.id}
      className="h-auto p-4 shadow-sm border border-gray-300 bg-white rounded-md"
      draggable
    >
      <div className="flex w-full">
        <div className="w-1/10 flex">
          <Icon name="DragAndDropIcon" className="cursor-move" />
        </div>
        <div className="flex-1 flex flex-col justify-between ml-2">
          <div className="flex items-center">
            <Icon name={getIcon as IconName} className="mr-2" />
            <p className="text-m text-gray-600">Lekcja: {item.displayOrder}</p>
          </div>
          <p className="text-s ml-8 text-gray-600 mt-2">{mappedItemType}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
