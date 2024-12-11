export type NavigationTab = "Settings" | "Lesson" | "Pricing" | "Status";
// export interface LessonItem {
//   lessonItemType: string;
//   displayOrder: number;
//   lessonItemId: string;
//   content: {
//     id: string;
//     title: string;
//     type?: string;
//     state?: "draft" | "published";
//     description?: string;
//     url?: string;
//   };
// }

export interface Lesson {
  type: string;
  displayOrder: number;
  id: string;
  title: string;
  description: string;
  fileS3Key?: string;
  fileType?: string;
  chapterId?: string;
}

export interface Chapter {
  id: string;
  title: string;
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
};

export type LessonIcons = "Text" | "Video" | "Presentation" | "Quiz";
