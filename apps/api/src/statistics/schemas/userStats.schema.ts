import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ActivityHistorySchema = Type.Record(Type.String(), Type.Boolean());

export const QuizStatsSchema = Type.Object({
  totalAttempts: Type.Number(),
  totalCorrectAnswers: Type.Number(),
  totalWrongAnswers: Type.Number(),
  totalQuestions: Type.Number(),
  averageScore: Type.Number(),
  uniqueQuizzesTaken: Type.Number(),
});

const MonthlyStatsSchema = Type.Object({
  started: Type.Number(),
  completed: Type.Number(),
  completionRate: Type.Number(),
});

export const CourseStatsSchema = Type.Record(Type.String(), MonthlyStatsSchema);

export const LessonsStatsSchema = Type.Record(Type.String(), MonthlyStatsSchema);

export const StreakSchema = Type.Object({
  current: Type.Number(),
  longest: Type.Number(),
  activityHistory: ActivityHistorySchema,
});

export const UserStatsSchema = Type.Object({
  quizzes: QuizStatsSchema,
  courses: CourseStatsSchema,
  lessons: LessonsStatsSchema,
  streak: StreakSchema,
});

export type UserStats = Static<typeof UserStatsSchema>;
