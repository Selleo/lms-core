import { Box, Button, Label } from "@adminjs/design-system";
import { ApiClient, type RecordJSON, type ShowPropertyProps } from "adminjs";
import React, { useEffect, useState } from "react";

const MaxPerPage = 500;

interface CourseLessonAssignment extends RecordJSON {
  params: {
    id: string;
    lesson_id: string;
    course_id: string;
  };
}

interface Lesson extends RecordJSON {
  params: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    course_lesson_id?: string;
  };
}

const CourseLessonsShow: React.FC<ShowPropertyProps> = ({ record }) => {
  const [assignedLessons, setAssignedLessons] = useState<Lesson[]>([]);
  const [unassignedLessons, setUnassignedLessons] = useState<Lesson[]>([]);

  const courseId = record.id;
  const api = new ApiClient();

  const fetchAllLessons = async () => {
    let allLessons: Lesson[] = [];
    let page = 1;

    while (true) {
      const response = await api.resourceAction({
        resourceId: "lessons",
        actionName: "list",
        params: {
          filters: { archived: false },
          page,
          perPage: MaxPerPage,
          sort: "title",
        },
      });

      const lessons: Lesson[] = response.data.records;
      allLessons = [...allLessons, ...lessons];

      if (lessons.length < MaxPerPage) {
        break;
      }

      page++;
    }

    return allLessons;
  };

  const fetchLessons = async () => {
    try {
      const assignedResponse = await api.resourceAction({
        resourceId: "course_lessons",
        actionName: "list",
        params: {
          filters: { course_id: courseId },
          perPage: MaxPerPage,
        },
      });

      const courseLessonAssignments: CourseLessonAssignment[] =
        assignedResponse.data.records;
      const lessonToCourseLessonMap = new Map(
        courseLessonAssignments.map((assignment) => [
          assignment.params.lesson_id,
          assignment.params.id,
        ]),
      );

      const allLessons = await fetchAllLessons();
      const assignedLessons: Lesson[] = [];
      const unassignedLessons: Lesson[] = [];

      allLessons.forEach((lesson: Lesson) => {
        const courseLessonId = lessonToCourseLessonMap.get(lesson.params.id);
        if (courseLessonId) {
          assignedLessons.push({
            ...lesson,
            params: {
              ...lesson.params,
              course_lesson_id: courseLessonId,
            },
          });
        } else {
          unassignedLessons.push(lesson);
        }
      });

      setAssignedLessons(assignedLessons);
      setUnassignedLessons(unassignedLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleAssign = async (lessonId: string) => {
    try {
      await api.resourceAction({
        resourceId: "course_lessons",
        actionName: "new",
        data: { course_id: courseId, lesson_id: lessonId },
      });

      await fetchLessons();
    } catch (error) {
      console.error("Error assigning lesson:", error);
    }
  };

  const handleRemove = async (courseLessonId: string | undefined) => {
    if (!courseLessonId) return;

    try {
      await api.recordAction({
        resourceId: "course_lessons",
        actionName: "delete",
        method: "post",
        recordId: courseLessonId,
      });

      await fetchLessons();
    } catch (error) {
      console.error("Error removing lesson:", error);
    }
  };

  const renderLessonList = (lessons: Lesson[], title: string) => (
    <Box mb={20} style={{ width: "50%" }}>
      <Label>{title}</Label>
      <Box style={{ width: "100%", maxHeight: "564px", overflowX: "auto" }}>
        <Box flex style={{ flexDirection: "column", gap: "1rem" }}>
          {lessons.map((lesson: Lesson) => (
            <Box
              key={lesson.params.id}
              flex
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f4f4f5",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Box flex style={{ alignItems: "center", gap: "0.5rem" }}>
                <img
                  src={lesson.params.image_url}
                  alt={lesson.params.title}
                  style={{ width: "100px", height: "100px" }}
                />
                <span>{lesson.params.title}</span>
              </Box>
              <Box>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() =>
                    title === "Assigned Lessons"
                      ? handleRemove(lesson.params.course_lesson_id)
                      : handleAssign(lesson.params.id)
                  }
                >
                  {title === "Assigned Lessons" ? "Remove" : "Assign"}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box flex style={{ display: "flex", width: "100%", gap: "1.5rem" }}>
      {renderLessonList(assignedLessons, "Assigned Lessons")}
      {renderLessonList(unassignedLessons, "Unassigned Lessons")}
    </Box>
  );
};

export default CourseLessonsShow;
