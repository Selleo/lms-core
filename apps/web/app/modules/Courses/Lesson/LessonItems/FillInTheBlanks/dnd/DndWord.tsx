import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Word = {
  id: number;
  index: number;
  value: string;
};

type DndWord = Word & {
  blankId: string;
};

type DndWordProps = {
  word: DndWord;
};

export const DndWord = ({ word }: DndWordProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: word.id });

  const cardStyle = {
    transform: CSS.Transform?.toString(transform),
    transition,
  };

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={cardStyle}
      className="px-2 py-1 bg-gray-100 rounded-md"
    >
      {word.value}
    </div>
  );
};
