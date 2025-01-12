import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";

import { DraggableWord } from "./DraggableWord";

import type { DndWord } from "./types";

type WordBankProps = {
  words: DndWord[];
};

export const WordBank = ({ words }: WordBankProps) => {
  const renderDraggableWords = () => {
    return words.map((word) => <DraggableWord key={word.id} word={word} />);
  };
  const { t } = useTranslation();

  const draggableWords = renderDraggableWords();

  return (
    <SortableContext id="blank_preset" items={words} strategy={horizontalListSortingStrategy}>
      <div className="mt-5">
        {t("studentLessonView.other.answers")}
        <div className="flex items-center flex-wrap min-h-12 rounded-lg min-w-20 gap-2">
          {draggableWords}
        </div>
      </div>
    </SortableContext>
  );
};
