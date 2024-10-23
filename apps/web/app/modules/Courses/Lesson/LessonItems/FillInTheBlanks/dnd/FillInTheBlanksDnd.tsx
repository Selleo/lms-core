import { type FC, useState } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SentenceBuilder } from "./SentenceBuilder";
import { DndBlank } from "./DndBlank";
import type { DndWord } from "./types";
import { DraggableWord } from "./DraggableWord";
import { WordBank } from "./WordBank";

type FillInTheBlanksDndProps = {
  questionLabel: string;
  content: string;
  sendAnswer: (
    selectedOption: { value: string; index: number }[],
  ) => Promise<void>;
  answers: DndWord[];
};

export const FillInTheBlanksDnd: FC<FillInTheBlanksDndProps> = ({
  questionLabel,
  content,
  sendAnswer,
  answers,
}) => {
  const [words, setWords] = useState<DndWord[]>(answers);
  const [currentlyDraggedWord, setCurrentlyDraggedWord] =
    useState<DndWord | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id: activeId } = active;

    const word = words.find(({ id }) => id === activeId);

    if (!word) return;

    setCurrentlyDraggedWord(word);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over || {};

    const activeBlankId = active?.data?.current?.sortable?.containerId;
    const overBlankId = over?.data?.current?.sortable?.containerId ?? overId;

    if (!activeBlankId || !overBlankId || activeBlankId === overBlankId) {
      return;
    }

    setWords((prev) => {
      const activeWords = prev.filter(
        ({ blankId }) => blankId === activeBlankId,
      );
      const activeWord = activeWords.find(({ id }) => id === activeId);
      const updatedWord = prev.find(({ id }) => id === activeWord?.id);

      if (updatedWord) {
        updatedWord.blankId = overBlankId;
      }

      return [...prev];
    });
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = active?.id;
    const overId = over?.id;

    if (!activeId || !overId) return;

    const activeBlankId = active?.data?.current?.sortable.containerId;
    const overBlankId = over?.data.current?.sortable?.containerId ?? overId;

    if (!activeBlankId || !overBlankId || activeBlankId !== overBlankId) {
      return;
    }

    setWords((prev) => {
      const activeWords = prev.filter(
        ({ blankId }) => blankId === activeBlankId,
      );

      const overWords = prev.filter(({ blankId }) => blankId === overBlankId);

      const activeWord = activeWords.find(({ id }) => id === activeId);
      const overWord = overWords.find(({ id }) => id === overId);

      if (!activeWord) return prev;

      const updatedWords = [
        ...new Set([
          ...arrayMove(
            overWords,
            activeWords.indexOf(activeWord),
            overWord ? overWords.indexOf(overWord) : 0,
          ),
          ...prev,
        ]),
      ];

      if (activeWords.length > 1) {
        const [firstWord, secondWord] = activeWords;

        const isChangedPositionInWordsBank =
          firstWord.blankId === "blank_preset" &&
          secondWord.blankId === "blank_preset";

        if (isChangedPositionInWordsBank) {
          return updatedWords;
        }

        firstWord.blankId = "blank_preset";

        const wordsWithUpdatedBlankId = [firstWord, secondWord];

        return [
          ...new Set([
            ...arrayMove(
              wordsWithUpdatedBlankId,
              activeWords.indexOf(firstWord),
              overWord ? wordsWithUpdatedBlankId.indexOf(secondWord) : 0,
            ),
            ...prev,
          ]),
        ];
      }

      const wordsPreparedForAnswer = updatedWords.map(({ value, index }) => {
        return { index, value };
      });

      sendAnswer(wordsPreparedForAnswer);

      return updatedWords;
    });

    setCurrentlyDraggedWord(null);
  }

  const wordBankWords = words.filter(
    ({ blankId }) => blankId === "blank_preset",
  );

  return (
    <div className="rounded-lg p-8 border bg-card text-card-foreground shadow-sm">
      <div className="details text-primary-700 uppercase">{questionLabel}</div>
      <div className="h6 text-neutral-950 my-4">Fill in the blanks.</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          {currentlyDraggedWord && (
            <DraggableWord word={currentlyDraggedWord} isOverlay />
          )}
        </DragOverlay>
        <SentenceBuilder
          content={content}
          replacement={(index) => {
            const blankPosition = index + 1;
            const blankId = `blank_${blankPosition}`;

            const wordsInBlank = words.filter(
              (word) => word.blankId === blankId,
            );

            return <DndBlank blankId={blankId} words={wordsInBlank} />;
          }}
        />
        <WordBank words={wordBankWords} />
      </DndContext>
    </div>
  );
};
