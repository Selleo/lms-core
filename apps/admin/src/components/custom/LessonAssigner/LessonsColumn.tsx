import { Box, Label } from "@adminjs/design-system";
import type { Lesson } from "./types.js";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LessonCard } from "./LessonCard.js";

type LessonsColumnsProps = {
  lessons: Lesson[];
  columnTitle: string;
  columnId: string;
};

export const LessonsColumn = ({
  lessons,
  columnTitle,
  columnId,
}: LessonsColumnsProps) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <SortableContext
      id={columnId}
      items={lessons}
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
            {lessons.map((lesson: Lesson & { columnId: string }) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </Box>
        </Box>
      </Box>
    </SortableContext>
  );
};
