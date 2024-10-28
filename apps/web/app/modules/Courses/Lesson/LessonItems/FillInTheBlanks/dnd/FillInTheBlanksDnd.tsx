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
  isQuiz: boolean;
  questionLabel: string;
  content: string;
  sendAnswer: (
    selectedOption: { value: string; index: number }[],
  ) => Promise<void>;
  answers: DndWord[];
};

export const FillInTheBlanksDnd: FC<FillInTheBlanksDndProps> = ({
  isQuiz = false,
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

  const maxAnswersAmount = content.match(/\[word]/g)?.length ?? 0;

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

        const updatedWords2 = [
          ...new Set([
            ...arrayMove(
              wordsWithUpdatedBlankId,
              activeWords.indexOf(firstWord),
              overWord ? wordsWithUpdatedBlankId.indexOf(secondWord) : 0,
            ),
            ...prev,
          ]),
        ];

        const filteredWords = updatedWords2
          .filter(({ blankId }) => blankId !== "blank_preset")
          .map((item) => {
            const newIndex = parseInt(
              item.blankId.match(/\d+$/)?.[0] ?? "0",
              10,
            );
            return {
              ...item,
              index: newIndex,
            };
          });

        if (
          filteredWords.length >= 1 &&
          filteredWords.length <= maxAnswersAmount
        ) {
          const sortedWords = filteredWords.sort((a, b) => a.index - b.index);
          if (
            sortedWords.length > 0 &&
            sortedWords.length <= maxAnswersAmount
          ) {
            sendAnswer(sortedWords);
          }
        }

        return updatedWords2;
      }

      const filteredWords = updatedWords
        .filter(({ blankId }) => blankId !== "blank_preset")
        .map((item) => {
          const newIndex = parseInt(item.blankId.match(/\d+$/)?.[0] ?? "0", 10);
          return {
            ...item,
            index: newIndex,
          };
        });

      if (
        filteredWords.length >= 1 &&
        filteredWords.length <= maxAnswersAmount
      ) {
        const sortedWords = filteredWords.sort((a, b) => a.index - b.index);
        if (sortedWords.length > 0 && sortedWords.length <= maxAnswersAmount) {
          sendAnswer(sortedWords);
        }
      }

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
            <DraggableWord
              isQuiz={isQuiz}
              word={currentlyDraggedWord}
              isOverlay
            />
          )}
        </DragOverlay>
        <SentenceBuilder
          content={content}
          replacement={(index) => {
            const blankId = `blank_${index}`;

            const wordsInBlank = words.filter(
              (word) => word.blankId === blankId,
            );

            return (
              <DndBlank
                isQuiz={isQuiz}
                blankId={blankId}
                words={wordsInBlank}
                isCorrect={wordsInBlank.some(({ isCorrect }) => !!isCorrect)}
                isStudentAnswer={wordsInBlank.some(
                  ({ isStudentAnswer }) => !!isStudentAnswer,
                )}
              />
            );
          }}
        />
        <WordBank words={wordBankWords} />
      </DndContext>
    </div>
  );
};
