export const PROGRESS_STATUS = {
  notStarted: "not_started",
  inProgress: "in_progress",
  completed: "completed",
} as const;

export type ProgressStatusType = (typeof PROGRESS_STATUS)[keyof typeof PROGRESS_STATUS];
