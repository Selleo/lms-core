export const LESSON_TYPES = {
  textBlock: "text_block",
  file: "file",
  presentation: "presentation",
  video: "video",
  quiz: "quiz",
} as const;

export type LessonTypes = (typeof LESSON_TYPES)[keyof typeof LESSON_TYPES];
