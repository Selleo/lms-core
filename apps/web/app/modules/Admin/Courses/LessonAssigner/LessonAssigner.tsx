import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type FC, useCallback, useEffect, useState } from "react";

import { useAddLessonToCourse } from "~/api/mutations/admin/useAddLessonToCourse";
import { useRemoveLessonFromCourse } from "~/api/mutations/admin/useRemoveLessonFromCourse";
import { useCourseById } from "~/api/queries/admin/useCourseById";
import { useAvailableLessons } from "~/api/queries/useAvailableLessons";

import { LessonCard } from "./LessonCard";

import type { GetAllLessonsResponse } from "~/api/generated-api";

type TransformedLesson = GetAllLessonsResponse["data"][number] & {
  columnId: string;
};

interface LessonAssignerProps {
  courseId: string;
}

interface LessonsColumnProps {
  lessons: TransformedLesson[];
  columnTitle: string;
  columnId: string;
}

const LessonsColumn: FC<LessonsColumnProps> = ({ lessons, columnTitle, columnId }) => {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div className="mb-5 w-full">
      <h3 className="text-lg font-semibold mb-2">{columnTitle}</h3>
      <div className="w-full max-h-[564px] overflow-x-auto">
        <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex flex-col gap-4">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

const LessonAssigner: FC<LessonAssignerProps> = ({ courseId }) => {
  const [lessons, setLessons] = useState<TransformedLesson[]>([]);
  const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<TransformedLesson | null>(null);

  const { data: course } = useCourseById(courseId);
  const { data: allLessons } = useAvailableLessons();
  const { mutateAsync: addLessonToCourse } = useAddLessonToCourse();
  const { mutateAsync: removeLessonFromCourse } = useRemoveLessonFromCourse();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (allLessons && course) {
      const courseAssignedLessonIds = course.lessons.map((lesson) => lesson.id);
      const transformedLessons = allLessons.map((lesson) => ({
        ...lesson,
        columnId: courseAssignedLessonIds.includes(lesson.id)
          ? "column-assigned"
          : "column-unassigned",
      }));
      setLessons(transformedLessons);
    }
  }, [allLessons, course]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedLesson = lessons.find((lesson) => lesson.id === active.id);
      if (draggedLesson) {
        setCurrentlyDraggedItem(draggedLesson);
      }
    },
    [lessons],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeLesson = lessons.find((lesson) => lesson.id === active.id);
      if (!activeLesson) return;

      const isOverAColumn = over.id === "column-assigned" || over.id === "column-unassigned";
      const newColumnId = isOverAColumn
        ? (over.id as string)
        : lessons.find((lesson) => lesson.id === over.id)?.columnId || activeLesson.columnId;

      if (activeLesson.columnId !== newColumnId) {
        try {
          if (newColumnId === "column-assigned") {
            await addLessonToCourse({
              data: { lessonId: activeLesson.id, courseId },
              courseId,
            });
          } else if (newColumnId === "column-unassigned") {
            await removeLessonFromCourse({
              courseId,
              lessonId: activeLesson.id,
            });
          }

          setLessons((prev) =>
            prev.map((lesson) =>
              lesson.id === activeLesson.id ? { ...lesson, columnId: newColumnId } : lesson,
            ),
          );
        } catch (error) {
          console.error("Error updating lesson assignment:", error);
        }
      } else {
        console.info("Lesson did not change columns, no mutation needed");
      }

      setCurrentlyDraggedItem(null);
    },
    [lessons, courseId, addLessonToCourse, removeLessonFromCourse],
  );

  const assignedLessons = lessons.filter((lesson) => lesson.columnId === "column-assigned");
  const unassignedLessons = lessons.filter((lesson) => lesson.columnId === "column-unassigned");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-4">
        <LessonsColumn
          columnId="column-assigned"
          columnTitle="Assigned Lessons"
          lessons={assignedLessons}
        />
        <LessonsColumn
          columnId="column-unassigned"
          columnTitle="Unassigned Lessons"
          lessons={unassignedLessons}
        />
      </div>
      <DragOverlay>
        {currentlyDraggedItem && <LessonCard lesson={currentlyDraggedItem} />}
      </DragOverlay>
    </DndContext>
  );
};

export default LessonAssigner;
