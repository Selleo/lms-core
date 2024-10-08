import type { RecordJSON } from "adminjs";

export interface CourseLessonAssignment extends RecordJSON {
  params: {
    id: string;
    lesson_id: string;
    course_id: string;
    display_order: number | null;
  };
}

export interface Lesson extends RecordJSON {
  params: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    course_lesson_id?: string;
    display_order: number | null;
  };
}

export type TransformedLesson = Lesson & { columnId: string };
