import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { startCase } from "lodash-es";

import { type GetAllLessonItemsResponse } from "~/api/generated-api";

type LessonItem = GetAllLessonItemsResponse["data"][number];

type TransformedLesson = LessonItem & {
  columnId: string;
};

interface LessonCardProps {
  lessonItem: TransformedLesson;
}

export function LessonItemCard({ lessonItem }: LessonCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lessonItem.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = () => {
    switch (lessonItem.itemType) {
      case "text_block":
        return (
          <>
            <h4 className="font-medium">{lessonItem.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-4">{lessonItem.body}</p>
          </>
        );
      case "question":
        return (
          <>
            <h4 className="font-medium">Question: {startCase(lessonItem.questionType)}</h4>
            <p className="text-sm text-gray-600 line-clamp-4">{lessonItem.questionBody}</p>
          </>
        );
      case "file":
        return (
          <>
            <h4 className="font-medium">{lessonItem.title}</h4>
            <p className="text-sm text-gray-600">File Type: {lessonItem.itemType}</p>
          </>
        );
      default:
        return <p>Unknown item type</p>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow flex justify-center gap-2 cursor-move flex-col"
    >
      {renderContent()}
    </div>
  );
}
