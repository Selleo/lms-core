import type { Lesson } from "./types.js";
import { useSortable } from "@dnd-kit/sortable";
import { Box } from "@adminjs/design-system";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

type LessonCardProps = {
  lesson: Lesson & { columnId: string; id?: string };
};

export const LessonCard = ({ lesson }: LessonCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const cardStyle = {
    transform: CSS.Transform?.toString(transform),
    transition,
  };

  return (
    <Box
      {...listeners}
      {...attributes}
      id={lesson?.id}
      key={lesson.params.id}
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
      <Box flex style={{ alignItems: "center", gap: "0.5rem" }}>
        <img
          src={lesson.params.image_url}
          alt={lesson.params.title}
          style={{ width: "100px", height: "100px" }}
        />
        <span>{lesson.params.title}</span>
      </Box>
    </Box>
  );
};
