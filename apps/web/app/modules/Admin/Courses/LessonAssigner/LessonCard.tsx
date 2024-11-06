import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      <img src={lesson.imageUrl} alt="" className="w-16 h-16 rounded-md" />
      <div>
        <h4 className="font-medium">{lesson.title}</h4>
        <Viewer content={lesson.description} />
      </div>
    </div>
  );
}
