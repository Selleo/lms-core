import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "~/lib/utils";
import type { DndWord } from "./types";

type DraggableWordProps = {
  word: DndWord;
  isOverlay?: boolean;
};

export const DraggableWord = ({ word, isOverlay }: DraggableWordProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: word.id });

  const cardStyle = {
    transform: CSS.Transform?.toString(transform),
  };

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={cardStyle}
      className={cn(
        !isDragging
          ? "px-2 py-1 bg-primary-200 rounded-md text-black"
          : "px-2 py-1 bg-gray-100 text-neutral-700 rounded-md blur-[0.3px]",
        { "-rotate-[6deg] w-min": isOverlay },
      )}
    >
      {word.value}
    </div>
  );
};
