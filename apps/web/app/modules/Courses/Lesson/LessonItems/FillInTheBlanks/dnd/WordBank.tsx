import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DraggableWord } from "./DraggableWord";
import type { DndWord } from "./types";

type WordBankProps = {
  words: DndWord[];
};

export const WordBank = ({ words }: WordBankProps) => {
  const renderDraggableWords = () => {
    return words.map((word) => <DraggableWord key={word.id} word={word} />);
  };

  const draggableWords = renderDraggableWords();

  return (
    <SortableContext
      id="blank_preset"
      items={words}
      strategy={horizontalListSortingStrategy}
    >
      <div className="mt-5">
        Answers:
        <div className="flex items-center h-12 rounded-lg min-w-20 gap-2 min-h-10">
          {draggableWords}
        </div>
      </div>
    </SortableContext>
  );
};
