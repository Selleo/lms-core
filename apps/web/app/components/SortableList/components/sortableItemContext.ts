import { createContext } from "react";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

interface Context {
  attributes: DraggableAttributes | object;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

export const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});
