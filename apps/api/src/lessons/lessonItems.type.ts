export const LESSON_ITEM_TYPES = [
  "text_block",
  "file",
  "question",
  "text",
  "presentation",
  "video",
  "quiz",
] as const;

export type LessonItemType = (typeof LESSON_ITEM_TYPES)[number];
