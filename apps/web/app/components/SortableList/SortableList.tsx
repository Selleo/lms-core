import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Fragment, useMemo, useState } from "react";

import { DragTrigger } from "~/components/SortableList/components/DragTrigger";
import { SortableItem } from "~/components/SortableList/components/SortableItem";
import { SortableOverlay } from "~/components/SortableList/components/SortableOverlay";

import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface BaseItem {
  id?: UniqueIdentifier;
  displayOrder?: number;
}

interface SortableListProps<T extends BaseItem> {
  items: T[];
  onChange(items: T[], newChapterPosition: number, newDisplayOrder: number): void;
  additionalOnChangeAction?(): void;
  renderItem(item: T, index?: number): ReactNode;
  className?: string;
  openQuestionIndexes?: Set<number>;
  setOpenQuestionIndexes?: React.Dispatch<React.SetStateAction<Set<number>>>;
}

/**
 * A sortable list component that allows users to rearrange items by dragging and dropping.
 * This component is unstyled, allowing full customization through external CSS classes.
 *
 * @param {Object[]} items - Array of items to be rendered in the list.
 * @param {Function} onChange - Callback function invoked when the order of items changes.
 * @param {string} [className] - Additional CSS classes for styling the container.
 * @param {Function} renderItem - Function to render each item in the list. It receives an item as a parameter and should return a React node.
 *
 */
export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  className,
  isQuiz = false,
  openQuestionIndexes,
  setOpenQuestionIndexes,
}: SortableListProps<T> & { isQuiz?: boolean }) {
  const [active, setActive] = useState<Active | null>(null);

  const activeItem = useMemo(() => {
    if (isQuiz && active) {
      const activeOrder = Number(active.id);
      return items.find((item) => item.displayOrder === activeOrder);
    }
    return items.find((item) => item.id === active?.id);
  }, [active, items, isQuiz]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          if (isQuiz) {
            const activeOrder = Number(active.id);
            const overOrder = Number(over.id);
            const activeIndex = items.findIndex((item) => item.displayOrder === activeOrder);
            const overIndex = items.findIndex((item) => item.displayOrder === overOrder);

            const updatedItems = arrayMove(items, activeIndex, overIndex);

            const updatedItemsWithOrder = updatedItems.map((item, index) => ({
              ...item,
              displayOrder: index + 1,
            }));
            const updatedItem = updatedItemsWithOrder[activeIndex];
            const newPosition = updatedItemsWithOrder.indexOf(updatedItem);
            const newDisplayOrder = newPosition + 1;

            // Check if the required variables are defined
            if (openQuestionIndexes && setOpenQuestionIndexes) {
              // Create a copy of the current open question indexes to modify
              const updatedOpenQuestionIndexes = new Set(openQuestionIndexes);

              // Determine whether the activeIndex and overIndex are currently open
              const wasActiveOpen = openQuestionIndexes.has(activeIndex);
              const wasOverOpen = openQuestionIndexes.has(overIndex);

              // Handle the case where both activeIndex and overIndex are already open
              if (wasActiveOpen && wasOverOpen) {
                // Remove both indexes temporarily
                updatedOpenQuestionIndexes.delete(activeIndex);
                updatedOpenQuestionIndexes.delete(overIndex);
                // Add them back to maintain their presence
                updatedOpenQuestionIndexes.add(overIndex);
                updatedOpenQuestionIndexes.add(activeIndex);
              } else {
                // Handle cases where only one of the indexes is open
                if (wasActiveOpen) {
                  // Replace the active index with the over index
                  updatedOpenQuestionIndexes.delete(activeIndex);
                  updatedOpenQuestionIndexes.add(overIndex);
                }
                if (wasOverOpen) {
                  // Replace the over index with the active index
                  updatedOpenQuestionIndexes.delete(overIndex);
                  updatedOpenQuestionIndexes.add(activeIndex);
                }
              }

              // Validate the open indexes against the updatedItemsWithOrder array
              updatedOpenQuestionIndexes.forEach((index) => {
                // If no item exists in updatedItemsWithOrder with a displayOrder matching index + 1,
                // remove the index from the set
                if (!updatedItemsWithOrder.some((item) => item.displayOrder === index + 1)) {
                  updatedOpenQuestionIndexes.delete(index);
                }
              });

              // Update the state with the newly calculated open question indexes
              setOpenQuestionIndexes(updatedOpenQuestionIndexes);
            }

            onChange(updatedItemsWithOrder, newPosition, newDisplayOrder);
            setActive(null);
          } else {
            const activeIndex = items.findIndex(({ id }) => id === active.id);
            const overIndex = items.findIndex(({ id }) => id === over.id);

            const updatedItems = arrayMove(items, activeIndex, overIndex);

            const updatedItemsWithOrder = updatedItems.map((item, index) => ({
              ...item,
              displayOrder: index + 1,
            }));

            const updatedItem = updatedItemsWithOrder.find((item) => item.id === active.id);

            const newChapterPosition = updatedItemsWithOrder.indexOf(updatedItem!);

            const newDisplayOrder = newChapterPosition + 1;

            onChange(updatedItemsWithOrder, newChapterPosition, newDisplayOrder);
            setActive(null);
          }
        }
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext
        items={
          isQuiz
            ? items.map((item) => item?.displayOrder?.toString() || "")
            : items.map((item) => item.id || "")
        }
      >
        <ul {...(className && { className })} role="application">
          {items?.map((item, index) => (
            <Fragment key={isQuiz ? item.displayOrder : item.id}>
              {renderItem(item, index)}
            </Fragment>
          ))}
        </ul>
      </SortableContext>
      <div className="list-none">
        <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
      </div>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragTrigger;
