import React, { FC, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FillInTheDndBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/dnd/FillInTheDndBlanks";
import { DndBlank } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/dnd/DndBlank";
import { DndWord } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/dnd/DndWord";

type FillInTheBlanksDndProps = {
  content: string;
  sendAnswer: (selectedOption: string[]) => Promise<void>;
  answers: {
    id: string;
    optionText: string;
    position: number | null;
  }[];
  register: UseFormRegister<TQuestionsForm>;
  questionId: string;
};

type Word = {
  id: number;
  index: number;
  value: string;
};

type DndWord = Word & {
  blankId: string;
};

const mockedWords = [
  { id: 1, index: 0, value: "Pszczyna", blankId: "blank_preset" },
  { id: 2, index: 0, value: "Warsaw", blankId: "blank_preset" },
  { id: 3, index: 0, value: "Poznań", blankId: "blank_preset" },
];

export const FillInTheBlanksDnd: FC<FillInTheBlanksDndProps> = ({
  content,
  sendAnswer,
  answers,
}) => {
  const [words, setWords] = useState<DndWord[]>(mockedWords);
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
      const overItem = overWords.find(({ id }) => id === overId);

      if (!activeWord) return prev;

      const updatedItems = [
        ...new Set([
          ...arrayMove(
            overWords,
            activeWords.indexOf(activeWord),
            overItem ? overWords.indexOf(overItem) : 0,
          ),
          ...prev,
        ]),
      ];

      return updatedItems;
    });

    setCurrentlyDraggedWord(null);
  }

  return (
    <div className="relative z-20">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative flex z-20 flex-col gap-y-12">
          <DragOverlay>
            {currentlyDraggedWord && <DndWord word={currentlyDraggedWord} />}
          </DragOverlay>
          <FillInTheDndBlanks
            content={content}
            replacement={(index) => {
              return (
                <DndBlank
                  key={index}
                  blankId={`blank_${index + 1}`}
                  words={words.filter(
                    (word) => word.blankId === `blank_${index + 1}`,
                  )}
                />
              );
            }}
          />
          <SortableContext
            id="blank_preset"
            items={words}
            strategy={verticalListSortingStrategy}
          >
            <div>
              Available words:
              <div className="flex items-center w-full gap-2 min-h-10">
                {words
                  .filter(({ blankId }) => blankId === "blank_preset")
                  .map((word) => (
                    <DndWord key={word.id} word={word} />
                  ))}
              </div>
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};
