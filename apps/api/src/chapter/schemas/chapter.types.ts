// import type { LESSON_ITEM_TYPE } from "../chapter.type";

// export const LessonTypes = {
//   presentation: "Presentation",
//   external_presentation: "External Presentation",
//   video: "Video",
//   external_video: "External Video",
// } as const;

export const ChapterProgress = {
  notStarted: "not_started",
  inProgress: "in_progress",
  completed: "completed",
} as const;

// export type LessonItemTypes = keyof typeof LESSON_ITEM_TYPE;

export type ChapterProgressType = (typeof ChapterProgress)[keyof typeof ChapterProgress];
