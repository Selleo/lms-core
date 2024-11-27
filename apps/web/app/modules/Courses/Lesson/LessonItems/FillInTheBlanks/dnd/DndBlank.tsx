import { useDroppable } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

import { DraggableWord } from "./DraggableWord";

import type { DndWord } from "./types";

type DndBlankProps = {
  isQuiz: boolean;
  words: DndWord[];
  blankId: string;
  isCorrect?: boolean | null;
  isStudentAnswer?: boolean;
};

export const DndBlank = ({ isQuiz, words, blankId, isCorrect, isStudentAnswer }: DndBlankProps) => {
  const { setNodeRef } = useDroppable({
    id: blankId,
  });

  return (
    <SortableContext id={blankId} items={words} strategy={rectSwappingStrategy}>
      <div
        ref={setNodeRef}
        className="min-w-32 h-9 mx-2 bg-white overflow-hidden border rounded-md"
      >
        {words.map((word) => (
          <DraggableWord
            isQuiz={isQuiz}
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
