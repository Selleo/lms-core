import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { DndWord } from "./DndWord";

type Word = {
  id: number;
  index: number;
  value: string;
};

type DndWord = Word & {
  blankId: string;
};

type DndBlankProps = {
  words: DndWord[];
  blankId: string;
};

export const DndBlank = ({ words, blankId }: DndBlankProps) => {
  const { setNodeRef } = useDroppable({
    id: blankId,
  });

  return (
    <SortableContext
      id={blankId}
      items={words}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="w-52 h-9 mx-2 bg-white border rounded-md"
      >
        {words.map((word) => (
          <DndWord key={word.id} word={word} />
        ))}
      </div>
    </SortableContext>
  );
};
