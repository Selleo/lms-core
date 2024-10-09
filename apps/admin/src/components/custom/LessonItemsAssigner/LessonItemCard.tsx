import { Box } from "@adminjs/design-system";
import React from "react";
import type { LessonItem } from "./types.js";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type LessonItemCardProps = {
  lessonItem: LessonItem & { columnId: string; id?: string };
};

export const LessonItemCard = ({ lessonItem }: LessonItemCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lessonItem.id });

  const cardStyle = {
    transform: CSS.Transform?.toString(transform),
    transition,
  };
  return (
    <Box
      {...listeners}
      {...attributes}
      id={lessonItem?.id}
      flex
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f4f4f5",
        borderRadius: "8px",
        overflow: "hidden",
        ...cardStyle,
      }}
      ref={setNodeRef}
    >
      <Box
        flex
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "start",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            aspectRatio: "1/1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100px",
            backgroundColor: "rgba(48, 64, 214, 0.8)",
            color: "white",
          }}
        >
          {lessonItem.params.type}
        </div>
        <span>{lessonItem.params.title}</span>
      </Box>
    </Box>
  );
};
