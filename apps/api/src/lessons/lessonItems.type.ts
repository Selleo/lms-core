export const LESSON_ITEM_TYPES = ["text_block", "file", "question"] as const;

export type LessonItemType = (typeof LESSON_ITEM_TYPES)[number];
