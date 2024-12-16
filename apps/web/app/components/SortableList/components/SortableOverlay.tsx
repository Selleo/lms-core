import { defaultDropAnimationSideEffects, DragOverlay } from "@dnd-kit/core";

import type { DropAnimation } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const SortableOverlay = ({ children }: PropsWithChildren) => (
  <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
);
