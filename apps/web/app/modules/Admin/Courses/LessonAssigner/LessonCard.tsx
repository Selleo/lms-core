import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import Viewer from "~/components/RichText/Viever";

import type { GetAllLessonsResponse } from "~/api/generated-api";

type TransformedLesson = GetAllLessonsResponse["data"][number] & {
  columnId: string;
};

interface LessonCardProps {
  lesson: TransformedLesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow flex items-center gap-2 cursor-move"
    >
      <img
        src={lesson.imageUrl ?? CardPlaceholder}
        alt=""
        className="w-16 h-16 rounded-md"
        onError={(e) => {
          (e.target as HTMLImageElement).src = CardPlaceholder;
        }}
      />
      <div>
        <h4 className="font-medium">{lesson.title}</h4>
        <Viewer content={lesson.description} />
      </div>
    </div>
  );
}
