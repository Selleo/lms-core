import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { useToggleLessonAsFree } from "~/api/mutations/admin/useToggleLessonAsFree";
import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import Viewer from "~/components/RichText/Viever";
import { Checkbox } from "~/components/ui/checkbox";

import type { GetAllLessonsResponse } from "~/api/generated-api";

type TransformedLesson = GetAllLessonsResponse["data"][number] & {
  columnId: string;
  courseId: string;
  isFree: boolean;
};

interface LessonCardProps {
  lesson: TransformedLesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: lesson.id,
  });

  const [isChecked, setIsChecked] = useState(lesson.isFree);

  const { mutateAsync: toggleLessonAsFree } = useToggleLessonAsFree();

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
        <Viewer className="line-clamp-2" content={lesson.description || ""} />
        {lesson.columnId === "column-assigned" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={lesson.id}
              checked={isChecked}
              onCheckedChange={(value) =>
                toggleLessonAsFree({
                  data: { lessonId: lesson.id, courseId: lesson.courseId, isFree: value === true },
                }).then(({ data }) => {
                  setIsChecked(data.isFree);
                })
              }
            />
            <label
              htmlFor={lesson.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Free
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
