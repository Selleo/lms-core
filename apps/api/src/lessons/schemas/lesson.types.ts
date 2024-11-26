export const LessonTypes = {
  presentation: "Presentation",
  external_presentation: "External Presentation",
  video: "Video",
  external_video: "External Video",
} as const;

export const LessonProgress = {
  notStarted: "not_started",
  inProgress: "in_progress",
  completed: "completed",
} as const;

export type LessonProgressType = (typeof LessonProgress)[keyof typeof LessonProgress];
