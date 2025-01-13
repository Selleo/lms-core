import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { DraggableWord } from "./DraggableWord";

import type { DndWord } from "./types";

type WordBankProps = {
  words: DndWord[];
};

export const WordBank = ({ words }: WordBankProps) => {
  const renderDraggableWords = () => {
    return words.map((word) => {
      const updatedWord =
        word.value !== word.studentAnswerText ? { ...word, studentAnswerText: word.value } : word;

      return <DraggableWord key={word.id} word={updatedWord ?? word} />;
    });
  };

  const draggableWords = renderDraggableWords();

  return (
    <SortableContext id="blank_preset" items={words} strategy={horizontalListSortingStrategy}>
      <div className="mt-5">
        Answers:
        <div className="flex items-center flex-wrap min-h-12 rounded-lg min-w-20 gap-2">
          {draggableWords}
        </div>
      </div>
    </SortableContext>
  );
};
