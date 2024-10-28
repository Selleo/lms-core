import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/lib/utils";
import type { DndWord } from "./types";

type DraggableWordProps = {
  isQuiz: boolean;
  word: DndWord;
  isOverlay?: boolean;
  isCorrect?: boolean | null;
  isStudentAnswer?: boolean;
};

export const DraggableWord = ({
  isQuiz,
  word,
  isOverlay,
  isCorrect,
  isStudentAnswer,
}: DraggableWordProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: word.id });

  const wordStyle = {
    transform: CSS.Transform?.toString(transform),
  };

  const quizWordStyle = cn("px-2 py-1 rounded-md text-black", {
    "bg-primary-200": (!isCorrect && !isStudentAnswer) || !isQuiz,
    "bg-success-200": isCorrect && isStudentAnswer && isQuiz,
    "bg-error-200":
      (!isCorrect && isStudentAnswer && isQuiz) ||
      (isCorrect && !isStudentAnswer && isQuiz),
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
          : "px-2 py-1 bg-gray-100 text-neutral-700 rounded-md blur-[0.3px]",
        { "-rotate-[6deg] w-min": isOverlay },
      )}
    >
      {word?.studentAnswerText ? word?.studentAnswerText : word.value}
    </div>
  );
};
