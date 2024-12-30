import { Question } from "./CourseLessons/NewLesson/QuizLessonForm/QuizLessonForm.types";

export type NavigationTab = "Settings" | "Curriculum" | "Pricing" | "Status";

export interface Lesson {
  updatedAt: string;
  type: string;
  displayOrder: number;
  id: string;
  title: string;
  description: string;
  fileS3Key?: string;
  fileType?: string;
  chapterId?: string;
  questions?: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  updatedAt: string;
  // description: string | null;
  // imageUrl: string | null;
  displayOrder: number;
  isFree: boolean;
  lessonCount: number;
  lessons: Lesson[];
}

export const ContentTypes = {
  EMPTY: "EMPTY",
  CHAPTER_FORM: "CHAPTER_FORM",
  SELECT_LESSON_TYPE: "SELECT_LESSON_TYPE",
  TEXT_LESSON_FORM: "TEXT_LESSON_FORM",
  VIDEO_LESSON_FORM: "VIDEO_LESSON_FORM",
  PRESENTATION_FORM: "PRESENTATION_FORM",
  QUIZ_FORM: "QUIZ_FORM",
};

export type LessonIcons = "Text" | "Video" | "Presentation" | "Quiz";

export const LessonType = {
  VIDEO: "video",
  TEXT: "text",
  PRESENTATION: "presentation",
  QUIZ: "quiz",
} as const;

export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export const DeleteContentType = {
  ...LessonType,
  CHAPTER: "chapter",
} as const;

export type DeleteContentType = (typeof DeleteContentType)[keyof typeof DeleteContentType];
