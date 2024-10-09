import { Box } from "@adminjs/design-system";
import { ApiClient, ShowPropertyProps } from "adminjs";
import React, { useEffect, useState } from "react";
import type {
  LessonItem,
  LessonItemRelation,
  TransformedLessonItem,
} from "./types.js";
import { fetchAllLessonItems } from "./utils.js";
import { LessonItemsColumn } from "./LessonItemsColumn.js";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { LessonItemCard } from "./LessonItemCard.js";

const MAX_LESSON_ITEMS_PER_PAGE = 500;

const LessonItemsAssigner: React.FC<ShowPropertyProps> = ({ record }) => {
  const [lessonItems, setLessonItems] = useState<TransformedLessonItem[]>([]);
  const [currentlyDraggedItem, setCurrentlyDraggedItem] =
    useState<TransformedLessonItem | null>(null);

  const lessonId = record.id;
  const api = new ApiClient();

  const fetchLessonItems = async () => {
    try {
      const assignedResponse = await api.resourceAction({
        resourceId: "lesson_items",
        actionName: "list",
        params: {
          filters: { lesson_id: lessonId },
          perPage: MAX_LESSON_ITEMS_PER_PAGE,
        },
      });

      const lessonItemAssignments: LessonItemRelation[] =
        assignedResponse.data.records;

      const itemToLessonItemMap = new Map(
        lessonItemAssignments.map((assignment) => [
          `${assignment.params.lesson_item_type}-${assignment.params.lesson_item_id}`,
          assignment.params.id,
        ]),
      );

      const allLessonItems = await fetchAllLessonItems(
        api,
        MAX_LESSON_ITEMS_PER_PAGE,
      );

      const assignedLessonItems: TransformedLessonItem[] = [];
      const unassignedLessonItems: TransformedLessonItem[] = [];

      allLessonItems.forEach((item: LessonItem) => {
        const lessonItemId = itemToLessonItemMap.get(
          `${item.params.type}-${item.params.id}`,
        );
        const relatedItem = lessonItemAssignments.find(
          ({ params }) => params.lesson_item_id === item.id,
        );

        if (lessonItemId) {
          assignedLessonItems.push({
            ...item,
            params: {
              ...item.params,
              lesson_item_id: lessonItemId,
              display_order: relatedItem?.params.display_order ?? null,
            },
            columnId: "column-assigned",
          });
        } else {
          unassignedLessonItems.push({
            ...item,
            columnId: "column-unassigned",
          });
        }
      });

      const sortedAssignedLessons = assignedLessonItems.toSorted((a, b) => {
        const displayOrderA = a.params.display_order ?? 0;
        const displayOrderB = b.params.display_order ?? 0;

        return displayOrderA - displayOrderB;
      });

      setLessonItems([...sortedAssignedLessons, ...unassignedLessonItems]);
    } catch (error) {}
  };

  const handleLessonItemAssign = async (
    lessonItem: TransformedLessonItem,
    index: number,
  ) => {
    try {
      await api.resourceAction({
        resourceId: "lesson_items",
        actionName: "new",
        data: {
          lesson_id: lessonId,
          lesson_item_id: lessonItem.params.id,
          lesson_item_type: lessonItem?.params.type,
          display_order: index,
        },
      });
    } catch (error) {
      console.error("Error assigning item:", error);
    }

    fetchLessonItems();
  };

  const handleChangeLessorOrder = async (
    updatedItems: TransformedLessonItem[],
    item: TransformedLessonItem,
  ) => {
    const items = updatedItems.filter(
      ({ columnId }) => columnId === "column-assigned",
    );
    const newItemActionIndex = items.indexOf(item);

    for (let index = 0; index < items.length; index++) {
      const lesson = items[index];

      if (index < newItemActionIndex && lesson?.params.lesson_item_id) {
        try {
          await api.recordAction({
            resourceId: "lesson_items",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.lesson_item_id,
            data: {
              lesson_item_type: lesson.params.type,
              lesson_id: lessonId,
              lesson_item_id: lesson.params.id,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }

      if (index === newItemActionIndex && lesson?.params.lesson_item_id) {
        try {
          await api.recordAction({
            resourceId: "lesson_items",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.lesson_item_id,
            data: {
              lesson_item_type: lesson.params.type,
              lesson_item_id: lesson.params.id,
              lesson_id: lessonId,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }

      if (index > newItemActionIndex && lesson?.params.lesson_item_id) {
        try {
          await api.recordAction({
            resourceId: "lesson_items",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.lesson_item_id,
            data: {
              lesson_item_type: lesson.params.type,
              lesson_item_id: lesson.params.id,
              lesson_id: lessonId,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }
    }

    fetchLessonItems();
  };

  const handleRemove = async (
    lessonItem: TransformedLessonItem | undefined,
  ) => {
    if (!lessonItem?.params.lesson_item_id) return;

    try {
      await api.recordAction({
        resourceId: "lesson_items",
        actionName: "delete",
        method: "post",
        recordId: lessonItem.params.lesson_item_id,
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const renderLessonItemsList = (lessonItems: TransformedLessonItem[]) => {
    const COLUMNS = 2;

    const assignedLessons = lessonItems.filter(
      ({ columnId }) => columnId === "column-assigned",
    );
    const unassignedLessons = lessonItems.filter(
      ({ columnId }) => columnId === "column-unassigned",
    );

    return Array.from({ length: COLUMNS }).map((_, index) => {
      return (
        <LessonItemsColumn
          key={index}
          lessonItems={index === 0 ? assignedLessons : unassignedLessons}
          columnTitle={
            index === 0 ? "Assigned Lesson Items" : "Unassigned Lesson Items"
          }
          columnId={index === 0 ? "column-assigned" : "column-unassigned"}
        />
      );
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id: activeId } = active;

    const lesson = lessonItems.find(({ id }) => id === activeId);

    if (!lesson) return;

    setCurrentlyDraggedItem(lesson);
  };

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over || {};

    const activeColumnId = active?.data?.current?.sortable?.containerId;
    const overColumnId = over?.data?.current?.sortable?.containerId ?? overId;

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return;
    }

    setLessonItems((prev) => {
      const activeLessons = prev.filter(
        ({ columnId }) => columnId === activeColumnId,
      );
      const activeLesson = activeLessons.find(({ id }) => id === activeId);
      const updatedLesson = prev.find(({ id }) => id === activeLesson?.id);

      if (updatedLesson) {
        updatedLesson.columnId = overColumnId;
      }

      return [...prev];
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = active?.id;
    const overId = over?.id;

    if (!activeId || !overId) return;

    const activeColumnId = active?.data?.current?.sortable.containerId;
    const overColumnId = over?.data.current?.sortable?.containerId ?? overId;

    if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) {
      return;
    }

    setLessonItems((prev) => {
      const activeLessons = prev.filter(
        ({ columnId }) => columnId === activeColumnId,
      );

      const overLessons = prev.filter(
        ({ columnId }) => columnId === overColumnId,
      );

      const activeLesson = activeLessons.find(({ id }) => id === activeId);
      const overItem = overLessons.find(({ id }) => id === overId);

      if (!activeLesson) return prev;

      const updatedItems = [
        ...new Set([
          ...arrayMove(
            overLessons,
            activeLessons.indexOf(activeLesson),
            overItem ? overLessons.indexOf(overItem) : 0,
          ),
          ...prev,
        ]),
      ];

      if (
        activeColumnId === "column-assigned" ||
        overColumnId === "column-assigned"
      ) {
        (async () => {
          await handleChangeLessorOrder(updatedItems, activeLesson);

          if (!activeLesson.params.lesson_item_id) {
            await handleLessonItemAssign(
              activeLesson,
              updatedItems.indexOf(activeLesson),
            );
          }
        })();
      }

      if (
        activeColumnId === "column-unassigned" ||
        overColumnId === "column-unassigned"
      ) {
        handleRemove(activeLesson);
      }

      return updatedItems;
    });

    setCurrentlyDraggedItem(null);
  }

  useEffect(() => {
    fetchLessonItems();
  }, [lessonId]);

  return (
    <Box
      grid
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        width: "100%",
        gap: "1.5rem",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          {currentlyDraggedItem && (
            <LessonItemCard lessonItem={currentlyDraggedItem} />
          )}
        </DragOverlay>
        {renderLessonItemsList(lessonItems)}
      </DndContext>
    </Box>
  );
};

export default LessonItemsAssigner;
