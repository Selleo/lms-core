import { useContext } from "react";

import { SortableItemContext } from "~/components/SortableList/components/sortableItemContext";

import type { PropsWithChildren } from "react";

export const DragTrigger = ({ children }: PropsWithChildren) => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button {...attributes} {...listeners} ref={ref}>
      {children}
    </button>
  );
};
