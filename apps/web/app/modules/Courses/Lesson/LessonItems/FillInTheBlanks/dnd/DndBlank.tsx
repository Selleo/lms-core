import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { DraggableWord } from "./DraggableWord";
import type { DndWord } from "./types";

type DndBlankProps = {
  words: DndWord[];
  blankId: string;
};

export const DndBlank = ({ words, blankId }: DndBlankProps) => {
  const { setNodeRef } = useDroppable({
    id: blankId,
  });

  return (
    <SortableContext id={blankId} items={words} strategy={rectSwappingStrategy}>
      <div
        ref={setNodeRef}
        className="w-52 h-9 mx-2 bg-white overflow-hidden border rounded-md"
      >
        {words.map((word) => (
          <DraggableWord key={word.id} word={word} />
        ))}
      </div>
    </SortableContext>
  );
};
