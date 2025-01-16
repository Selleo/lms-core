import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "~/lib/utils";

import type { DndWord } from "./types";

type DraggableWordProps = {
  word: DndWord;
  isOverlay?: boolean;
  isCorrect?: boolean | null;
  isStudentAnswer?: boolean;
};

export const DraggableWord = ({
  word,
  isOverlay,
  isCorrect,
  isStudentAnswer,
}: DraggableWordProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: word.id,
    disabled: !!isStudentAnswer,
  });

  const wordStyle = {
    transform: CSS.Transform?.toString(transform),
  };

  const quizWordStyle = cn("px-2 py-1 rounded-md text-black", {
    "bg-primary-200": !isCorrect && !isStudentAnswer,
    "bg-success-200": isCorrect && isStudentAnswer,
    "bg-error-200": (!isCorrect && isStudentAnswer) || (isCorrect && !isStudentAnswer),
  });

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={wordStyle}
      className={cn(
        !isDragging
          ? quizWordStyle
          : "rounded-md bg-gray-100 px-2 py-1 text-neutral-700 blur-[0.3px]",
        { "w-max -rotate-[6deg]": isOverlay },
      )}
    >
      {word?.studentAnswerText ? word?.studentAnswerText : word.value}
    </div>
  );
};
