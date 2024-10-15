import React, { FC, useEffect, useState, useCallback } from "react";
import {
  allLessonsQueryOptions,
  useAllLessons,
  useAllLessonsSuspense,
} from "~/api/queries/useAllLessons";
import { useUpdateCourse } from "~/api/mutations/useUpdateCourse";
import { GetAllLessonsResponse } from "~/api/generated-api";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { queryClient } from "~/api/queryClient";
import { useAddLessonToCourse } from "~/api/mutations/useAddLessonToCourse";
import { useRemoveLessonFromCourse } from "~/api/mutations/useRemoveLessonFromCourse copy";
import { LessonCard } from "./LessonCard";
import { useCourse } from "~/api/queries";
import { useNonCourseLessons } from "~/api/queries/useNonCourseLessons";

export const clientLoader = () => {
  queryClient.prefetchQuery(allLessonsQueryOptions);
  return null;
};

type TransformedLesson = GetAllLessonsResponse["data"][number] & {
  columnId: string;
};

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface LessonAssignerProps {
  courseId: string;
  assignedLessonIds: string[];
}

const LessonAssigner: FC<LessonAssignerProps> = ({
  courseId,
  assignedLessonIds: initialAssignedLessonIds,
}) => {
  const [lessons, setLessons] = useState<TransformedLesson[]>([]);
  const [assignedLessonIds, setAssignedLessonIds] = useState<string[]>(
    initialAssignedLessonIds
  );

  // const { data: { lessons: courseLessons } = {} } = useCourse(courseId);
  // const {} = useNonCourseLessons();
  const { data: allLessons } = useAllLessons();
  const { mutateAsync: addLessonToCourse } = useAddLessonToCourse();
  const { mutateAsync: removeLessonFromCourse } = useRemoveLessonFromCourse();

  useEffect(() => {
    if (allLessons) {
      const transformedLessons = allLessons.map((lesson) => ({
        ...lesson,
        columnId: assignedLessonIds.includes(lesson.id)
          ? "column-assigned"
          : "column-unassigned",
      }));
      setLessons(transformedLessons);
    }
  }, [allLessons, assignedLessonIds]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeLesson = lessons.find((lesson) => lesson.id === active.id);
      if (!activeLesson) return;

      const newColumnId =
        over.id === "column-assigned" || over.id === "column-unassigned"
          ? over.id
          : activeLesson.columnId === "column-assigned"
            ? "column-unassigned"
            : "column-assigned";

      if (newColumnId === activeLesson.columnId) return;

      try {
        if (newColumnId === "column-assigned") {
          await addLessonToCourse({
            data: { lessonId: activeLesson.id, courseId },
            courseId,
          });
        } else {
          await removeLessonFromCourse({ courseId, lessonId: activeLesson.id });
        }

        const newLessons = lessons.map((lesson) =>
          lesson.id === activeLesson.id
            ? { ...lesson, columnId: newColumnId }
            : lesson
        );

        setLessons(newLessons);
        setAssignedLessonIds(
          newLessons
            .filter((lesson) => lesson.columnId === "column-assigned")
            .map((lesson) => lesson.id)
        );
      } catch (error) {
        console.error("Failed to update lesson assignment:", error);
      }
    },
    [lessons, courseId, addLessonToCourse, removeLessonFromCourse]
  );

  const renderLessonList = (
    columnLessons: TransformedLesson[],
    title: string
  ) => (
    <div className="bg-gray-100 p-4 rounded-lg h-screen overflow-scroll">
      <h3 className="text-lg font-semibold mb-2">
        {title} ({columnLessons.length})
      </h3>
      <SortableContext
        items={columnLessons}
        strategy={verticalListSortingStrategy}
      >
        {columnLessons.map((lesson) => (
          <SortableItem key={lesson.id} id={lesson.id}>
            <LessonCard lesson={lesson} />
          </SortableItem>
        ))}
      </SortableContext>
    </div>
  );

  const assignedLessons = lessons.filter(
    (lesson) => lesson.columnId === "column-assigned"
  );
  const unassignedLessons = lessons.filter(
    (lesson) => lesson.columnId === "column-unassigned"
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-4">
        {renderLessonList(assignedLessons, "Assigned Lessons")}
        {renderLessonList(unassignedLessons, "Unassigned Lessons")}
      </div>
    </DndContext>
  );
};

export default LessonAssigner;
