import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";
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
  averageStats: Type.Object({
    lessonStats: MonthlyStatsSchema,
    courseStats: MonthlyStatsSchema,
  }),
  quizzes: QuizStatsSchema,
  courses: CourseStatsSchema,
  lessons: LessonsStatsSchema,
  streak: StreakSchema,
  lastLesson: Type.Union([
    Type.Null(),
    Type.Object({
      ...lessonSchema.properties,
      courseId: UUIDSchema,
      courseTitle: Type.String(),
      courseDescription: Type.String(),
    }),
  ]),
});

export const PopularCourseStatsSchema = Type.Object({
  courseName: Type.String(),
  studentCount: Type.Number(),
});

export const TeacherStatsSchema = Type.Object({
  fiveMostPopularCourses: Type.Array(PopularCourseStatsSchema),
  totalCoursesCompletionStats: Type.Object({
    totalCoursesCompletion: Type.Number(),
    totalCourses: Type.Number(),
  }),
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
export type TeacherStats = Static<typeof TeacherStatsSchema>;
