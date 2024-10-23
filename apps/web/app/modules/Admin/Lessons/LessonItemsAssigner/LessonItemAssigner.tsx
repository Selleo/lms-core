import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { FC, useCallback, useEffect, useState } from "react";
import { GetAllLessonItemsResponse } from "~/api/generated-api";
import { useAssignItemToLesson } from "~/api/mutations/admin/useAssignItemToLesson";
import { useUnassignItemToLesson } from "~/api/mutations/admin/useUnassignItemToLesson";
import { useLesson } from "~/api/queries";
import { LessonItemCard } from "./LessonItemCard";
import { useAvailableLessonItems } from "~/api/queries/admin/useAvailableLessonItems";

type TransformedLessonItem = GetAllLessonItemsResponse["data"][number] & {
  columnId: string;
};

interface LessonItemAssignerProps {
  lessonId: string;
}

interface LessonsColumnProps {
  lessons: TransformedLessonItem[];
  columnTitle: string;
  columnId: string;
}

const LessonsColumn: FC<LessonsColumnProps> = ({
  lessons,
  columnTitle,
  columnId,
}) => {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div className="mb-5 w-full">
      <h3 className="text-lg font-semibold mb-2">{columnTitle}</h3>
      <div className="w-full max-h-[564px] overflow-x-auto">
        <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex flex-col gap-4">
            {lessons.map((lesson) => (
              <LessonItemCard key={lesson.id} lessonItem={lesson} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

const LessonItemAssigner: FC<LessonItemAssignerProps> = ({ lessonId }) => {
  const [lessonItems, setLessonsItems] = useState<TransformedLessonItem[]>([]);
  const [currentlyDraggedItem, setCurrentlyDraggedItem] =
    useState<TransformedLessonItem | null>(null);

  const { data: lesson } = useLesson(lessonId);
  const { data: allLessonItems } = useAvailableLessonItems();
  const { mutateAsync: assignItems } = useAssignItemToLesson();
  const { mutateAsync: unassignItems } = useUnassignItemToLesson();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (allLessonItems && lesson) {
      const assignedContentIds = lesson.lessonItems.map(
        (lessonItem) => lessonItem.content.id
      );

      const transformedLessons = allLessonItems.map((item) => ({
        ...item,
        columnId: assignedContentIds.includes(item.id)
          ? "column-assigned"
          : "column-unassigned",
      }));

      setLessonsItems(transformedLessons);
    }
  }, [allLessonItems, lesson]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedLesson = lessonItems.find(
        (lesson) => lesson.id === active.id
      );
      if (draggedLesson) {
        setCurrentlyDraggedItem(draggedLesson);
      }
    },
    [lessonItems]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeLesson = lessonItems.find(
        (lessonItem) => lessonItem.id === active.id
      );
      if (!activeLesson) return;

      const isOverAColumn =
        over.id === "column-assigned" || over.id === "column-unassigned";
      const newColumnId = isOverAColumn
        ? (over.id as string)
        : lessonItems.find((lessonItem) => lessonItem.id === over.id)
            ?.columnId || activeLesson.columnId; // TODO: remove nested ternary

      if (activeLesson.columnId !== newColumnId) {
        try {
          if (newColumnId === "column-assigned") {
            await assignItems({
              data: {
                items: [{ id: activeLesson.id, type: activeLesson.itemType }],
              },
              lessonId,
            });
          } else if (newColumnId === "column-unassigned") {
            await unassignItems({
              lessonId,
              data: {
                items: [{ id: activeLesson.id, type: activeLesson.itemType }],
              },
            });
          }

          setLessonsItems((prev) =>
            prev.map((lesson) =>
              lesson.id === activeLesson.id
                ? { ...lesson, columnId: newColumnId }
                : lesson
            )
          );
        } catch (error) {
          console.error("Error updating lesson assignment:", error);
        }
      }

      setCurrentlyDraggedItem(null);
    },
    [lessonItems, lessonId, assignItems, unassignItems]
  );

  const assignedLessons = lessonItems.filter(
    (lesson) => lesson.columnId === "column-assigned"
  );
  const unassignedLessons = lessonItems.filter(
    (lesson) => lesson.columnId === "column-unassigned"
  );

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
          columnTitle="Assigned Lesson Items"
          lessons={assignedLessons}
        />
        <LessonsColumn
          columnId="column-unassigned"
          columnTitle="Unassigned Lesson Items"
          lessons={unassignedLessons}
        />
      </div>
      <DragOverlay>
        {currentlyDraggedItem && (
          <LessonItemCard lessonItem={currentlyDraggedItem} />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default LessonItemAssigner;
