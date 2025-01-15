import { useDroppable } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

import { DraggableWord } from "./DraggableWord";

import type { DndWord } from "./types";

type DndBlankProps = {
  words: DndWord[];
  blankId: string;
  isCorrect?: boolean | null;
  isStudentAnswer?: boolean;
};

export const DndBlank = ({ words, blankId, isCorrect, isStudentAnswer }: DndBlankProps) => {
  const { setNodeRef } = useDroppable({
    id: blankId,
  });

  return (
    <SortableContext id={blankId} items={words} strategy={rectSwappingStrategy}>
      <div
        ref={setNodeRef}
        className="mx-2 h-9 min-w-32 overflow-hidden rounded-md border bg-white"
      >
        {words.map((word) => (
          <DraggableWord
            key={word.id}
            word={word}
            isCorrect={isCorrect}
            isStudentAnswer={isStudentAnswer}
          />
        ))}
      </div>
    </SortableContext>
  );
};
