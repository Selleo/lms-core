import { Type } from "@sinclair/typebox";

import { lessonSchema } from "src/lessons/schemas/lesson.schema";

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

const StatsByMonthSchema = Type.Object({
  month: Type.String(),
  ...MonthlyStatsSchema.properties,
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
  lastLesson: lessonSchema,
});

const UserStatisticSchema = Type.Object({
  currentStreak: Type.Number(),
  longestStreak: Type.Number(),
  lastActivityDate: Type.Date(),
  activityHistory: ActivityHistorySchema,
});

export type UserStats = Static<typeof UserStatsSchema>;
export type StatsByMonth = Static<typeof StatsByMonthSchema>;
export type UserStatistic = Static<typeof UserStatisticSchema>;
