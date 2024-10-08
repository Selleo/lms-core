import { Box } from "@adminjs/design-system";
import { ApiClient, type ShowPropertyProps } from "adminjs";
import React, { type FC, useEffect, useState } from "react";

import type { CourseLessonAssignment, Lesson } from "./types.js";
import { fetchAllLessons } from "./utils.js";
import { LessonsColumn } from "./LessonsColumn.js";
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
import { LessonCard } from "./LessonCard.js";

const MAX_LESSONS_PER_PAGE = 500;

type TransformedLesson = Lesson & {
  columnId: string;
};

const LessonAssigner: FC<ShowPropertyProps> = ({ record }) => {
  const [lessons, setLessons] = useState<TransformedLesson[]>([]);
  const [currentlyDraggedItem, setCurrentlyDraggedItem] =
    useState<TransformedLesson | null>(null);

  const courseId = record.id;
  const api = new ApiClient();

  const fetchLessons = async () => {
    try {
      const assignedResponse = await api.resourceAction({
        resourceId: "course_lessons",
        actionName: "list",
        params: {
          filters: { course_id: courseId },
          perPage: MAX_LESSONS_PER_PAGE,
        },
      });

      const courseLessonAssignments: CourseLessonAssignment[] =
        assignedResponse.data.records;

      const lessonToCourseLessonMap = new Map(
        courseLessonAssignments.map((assignment) => {
          return [assignment.params.lesson_id, assignment.params.id];
        }),
      );

      const allLessons = await fetchAllLessons(api, MAX_LESSONS_PER_PAGE);

      const assignedLessons: TransformedLesson[] = [];
      const unassignedLessons: TransformedLesson[] = [];

      allLessons.forEach((lesson: TransformedLesson) => {
        const courseLessonId = lessonToCourseLessonMap.get(lesson.params.id);
        const relatedLesson = courseLessonAssignments.find(
          ({ params }) => params.lesson_id === lesson.params.id,
        );

        if (courseLessonId) {
          assignedLessons.push({
            ...lesson,
            columnId: `column-assigned`,
            params: {
              ...lesson.params,
              course_lesson_id: courseLessonId,
              display_order: relatedLesson?.params?.display_order ?? null,
            },
          });
        } else {
          unassignedLessons.push({ ...lesson, columnId: `column-unassigned` });
        }
      });

      const sortedAssignedLessons = assignedLessons.toSorted((a, b) => {
        const displayOrderA = a.params.display_order ?? 0;
        const displayOrderB = b.params.display_order ?? 0;

        return displayOrderA - displayOrderB;
      });

      setLessons([...sortedAssignedLessons, ...unassignedLessons]);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const handleLessonAssign = async (
    lesson: TransformedLesson,
    index: number,
  ) => {
    try {
      await api.resourceAction({
        resourceId: "course_lessons",
        actionName: "new",
        data: {
          course_id: courseId,
          lesson_id: lesson.id,
          display_order: index,
        },
      });
    } catch (error) {
      console.error("Error assigning lesson:", error);
    }

    fetchLessons();
  };

  const handleChangeLessorOrder = async (
    updatedItems: TransformedLesson[],
    item: TransformedLesson,
  ) => {
    const items = updatedItems.filter(
      ({ columnId }) => columnId === "column-assigned",
    );
    const newItemActionIndex = items.indexOf(item);

    for (let index = 0; index < items.length; index++) {
      const lesson = items[index];

      if (index < newItemActionIndex && lesson?.params.course_lesson_id) {
        try {
          await api.recordAction({
            resourceId: "course_lessons",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.course_lesson_id,
            data: {
              course_id: courseId,
              lesson_id: lesson.id,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }

      if (index === newItemActionIndex && lesson?.params.course_lesson_id) {
        try {
          await api.recordAction({
            resourceId: "course_lessons",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.course_lesson_id,
            data: {
              course_id: courseId,
              lesson_id: lesson.id,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }

      if (index > newItemActionIndex && lesson?.params.course_lesson_id) {
        try {
          await api.recordAction({
            resourceId: "course_lessons",
            actionName: "edit",
            method: "post",
            recordId: lesson.params.course_lesson_id,
            data: {
              course_id: courseId,
              lesson_id: lesson.id,
              display_order: index,
            },
          });
        } catch (error) {
          console.error("Error updating lesson order:", error);
        }
      }
    }

    fetchLessons();
  };

  const handleRemove = async (lesson: TransformedLesson | undefined) => {
    if (!lesson?.params?.course_lesson_id) return;

    try {
      await api.recordAction({
        resourceId: "course_lessons",
        actionName: "delete",
        method: "post",
        recordId: lesson?.params?.course_lesson_id,
      });
    } catch (error) {
      console.error("Error removing lesson:", error);
    }
  };

  const renderLessonList = (lessons: TransformedLesson[]) => {
    const COLUMNS = 2;

    const assignedLessons = lessons.filter(
      ({ columnId }) => columnId === "column-assigned",
    );
    const unassignedLessons = lessons.filter(
      ({ columnId }) => columnId === "column-unassigned",
    );

    return Array.from({ length: COLUMNS }).map((_, index) => {
      return (
        <LessonsColumn
          key={index}
          lessons={index === 0 ? assignedLessons : unassignedLessons}
          columnTitle={index === 0 ? "Assigned Lessons" : "Unassigned Lessons"}
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

    const lesson = lessons.find(({ id }) => id === activeId);

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

    setLessons((prev) => {
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

    setLessons((prev) => {
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

          if (!activeLesson.params.course_lesson_id) {
            await handleLessonAssign(
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
    fetchLessons();
  }, [courseId]);

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
          {currentlyDraggedItem && <LessonCard lesson={currentlyDraggedItem} />}
        </DragOverlay>
        {renderLessonList(lessons)}
      </DndContext>
    </Box>
  );
};

export default LessonAssigner;
