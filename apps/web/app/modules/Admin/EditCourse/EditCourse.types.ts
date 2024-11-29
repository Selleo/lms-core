export type NavigationTab = "Settings" | "Lesson" | "Pricing" | "Status";
export interface LessonItem {
  id: string;
  title: string;
  lessonItemType: string;
  displayOrder: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isFree: boolean;
  itemsCount: number;
  lessonItems: LessonItem[];
}

export const ContentTypes = {
  EMPTY: "EMPTY",
  NEW_CHAPTER: "NEW_CHAPTER",
  EDIT_CHAPTER: "EDIT_CHAPTER",
  SELECT_LESSON_TYPE: "SELECT_LESSON_TYPE",
  ADD_TEXT_LESSON: "ADD_TEXT_LESSON",
};
