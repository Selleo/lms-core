import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import { SortableItemContext } from "~/components/SortableList/components/sortableItemContext";

import type { UniqueIdentifier } from "@dnd-kit/core";
import type { CSSProperties, PropsWithChildren } from "react";

interface SortableItemProps {
  id: UniqueIdentifier;
}

export function SortableItem({ children, id }: PropsWithChildren<SortableItemProps>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}
