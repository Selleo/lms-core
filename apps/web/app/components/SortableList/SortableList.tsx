import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Fragment, useMemo, useState } from "react";

import { DragTrigger } from "~/components/SortableList/components/DragTrigger";
import { SortableItem } from "~/components/SortableList/components/SortableItem";
import { SortableOverlay } from "~/components/SortableList/components/SortableOverlay";

import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface BaseItem {
  id: UniqueIdentifier;
  displayOrder?: number;
}

interface SortableListProps<T extends BaseItem> {
  items: T[];
  onChange(items: T[], newChapterPosition: number, newDisplayOrder: number): void;
  additionalOnChangeAction?(): void;
  renderItem(item: T, index?: number): ReactNode;
  className?: string;
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
}: SortableListProps<T> & { isQuiz?: boolean }) {
  const [active, setActive] = useState<Active | null>(null);

  // Używamy displayOrder jako identyfikatora
  const activeItem = useMemo(() => {
    if (isQuiz && active) {
      // Jeżeli isQuiz, to aktywny element będzie na podstawie displayOrder
      const activeOrder = Number(active.id); // active.id to teraz displayOrder
      return items.find((item) => (item.displayOrder as number) === activeOrder);
    }
    return items.find((item) => item.id === active?.id); // Dla innych przypadków
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
        setActive(active); // Ustawiamy aktywny element
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          // Obliczamy indeksy na podstawie displayOrder
          const activeOrder = Number(active.id); // Teraz active.id to displayOrder
          const overOrder = Number(over.id); // To samo dla over.id

          const activeIndex = items.findIndex((item) => item.displayOrder === activeOrder);
          const overIndex = items.findIndex((item) => item.displayOrder === overOrder);

          // Modyfikacja listy z nowymi elementami
          const updatedItems = arrayMove(items, activeIndex, overIndex);

          const updatedItemsWithOrder = updatedItems.map((item, index) => ({
            ...item,
            displayOrder: index + 1, // Aktualizacja displayOrder
          }));

          const updatedItem = updatedItemsWithOrder[activeIndex];
          const newChapterPosition = updatedItemsWithOrder.indexOf(updatedItem);
          const newDisplayOrder = newChapterPosition + 1;

          // Wywołanie onChange z nowymi wartościami
          onChange(updatedItemsWithOrder, newChapterPosition, newDisplayOrder);
        }

        setActive(null); // Zresetuj stan po zakończeniu
      }}
      onDragCancel={() => {
        setActive(null); // Zresetuj stan w przypadku anulowania
      }}
    >
      <SortableContext
        items={
          isQuiz
            ? items.map((item) => item?.displayOrder?.toString() as any)
            : items.map((item) => item.id)
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
