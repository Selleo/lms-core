import { Box, Label } from "@adminjs/design-system";
import React from "react";
import { LessonItemCard } from "./LessonItemCard.js";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { TransformedLessonItem } from "./types.js";

type LessonItemsColumnsProps = {
  lessonItems: TransformedLessonItem[];
  columnTitle: string;
  columnId: string;
};

export const LessonItemsColumn = ({
  lessonItems,
  columnTitle,
  columnId,
}: LessonItemsColumnsProps) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <SortableContext
      id={columnId}
      items={lessonItems}
      strategy={verticalListSortingStrategy}
    >
      <Box mb={20} style={{ width: "100%" }}>
        <Label>{columnTitle}</Label>
        <Box style={{ width: "100%", maxHeight: "564px", overflowX: "auto" }}>
          <Box
            flex
            style={{ flexDirection: "column", gap: "1rem" }}
            ref={setNodeRef}
          >
            {lessonItems.map((lessonItem) => {
              return (
                <LessonItemCard key={lessonItem.id} lessonItem={lessonItem} />
              );
            })}
          </Box>
        </Box>
      </Box>
    </SortableContext>
  );
};
