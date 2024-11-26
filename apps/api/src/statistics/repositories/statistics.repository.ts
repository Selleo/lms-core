import { Inject, Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LessonProgress } from "src/lessons/schemas/lesson.types";
import {
  lessons,
  quizAttempts,
  studentCourses,
  studentLessonsProgress,
  userStatistics,
} from "src/storage/schema";

import type { StatsByMonth, UserStatistic } from "src/statistics/schemas/userStats.schema";

@Injectable()
export class StatisticsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getQuizStats(userId: string) {
    const [quizStatsResult] = await this.db
      .select({
        totalAttempts: sql<number>`count(*) :: INTEGER`,
        totalCorrectAnswers: sql<number>`coalesce(sum(${quizAttempts.correctAnswers}), 0) :: INTEGER`,
        totalWrongAnswers: sql<number>`coalesce(sum(${quizAttempts.wrongAnswers}), 0) :: INTEGER`,
        totalQuestions: sql<number>`coalesce(sum(${quizAttempts.correctAnswers} + ${quizAttempts.wrongAnswers}), 0) :: INTEGER`,
        averageScore: sql<number>`coalesce(round(avg(${quizAttempts.score}), 2), 0) :: INTEGER`,
        uniqueQuizzesTaken: sql<number>`coalesce(count(distinct ${quizAttempts.lessonId}), 0) :: INTEGER`,
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId));

    return quizStatsResult;
  }

  async getCoursesStatsByMonth(userId: string): Promise<StatsByMonth[]> {
    return this.db.execute(sql`
      WITH completed_courses AS (
        SELECT
          date_trunc('month', ${studentCourses.completedAt}) AS "month",
          COUNT(*)::INTEGER AS "completed_courses_count"
        FROM
          ${studentCourses}
        WHERE
        ${studentCourses.studentId} = ${userId}
          AND ${studentCourses.state} = ${LessonProgress.completed}
          AND ${studentCourses.completedAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY
          date_trunc('month', ${studentCourses.completedAt})
      ),
      month_stats AS (
        SELECT
          to_char(date_trunc('month', ${studentCourses.createdAt}), 'YYYY-MM') AS month,
          COUNT(DISTINCT ${studentCourses.courseId})::INTEGER AS started,
          (CASE WHEN completed_courses.completed_courses_count IS NOT NULL THEN completed_courses.completed_courses_count ELSE 0 END)::INTEGER AS completed
        FROM
        ${studentCourses}
          LEFT JOIN completed_courses ON date_trunc('month', ${studentCourses.createdAt}) = completed_courses.month
        WHERE
        ${studentCourses.studentId} = ${userId}
          AND ${studentCourses.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY
          date_trunc('month', ${studentCourses.createdAt}), completed_courses.month, completed_courses.completed_courses_count
        ORDER BY
          date_trunc('month', ${studentCourses.createdAt})
      )
      SELECT
        month_stats.month AS month,
        month_stats.started AS started,
        month_stats.completed AS completed,
        COALESCE(ROUND((month_stats.completed::NUMERIC / NULLIF(month_stats.started::NUMERIC, 0)) * 100, 2)::INTEGER, 0) AS "completionRate"
      FROM
        month_stats
    `);
  }

  async getLessonsStatsByMonth(userId: string): Promise<StatsByMonth[]> {
    return this.db.execute(sql`
      WITH completed_lessons AS (
        SELECT
          date_trunc('month',
              ${studentLessonsProgress.completedAt}) AS month,
          COUNT(${studentLessonsProgress.id}) AS completed_lessons_count
        FROM
          ${studentLessonsProgress}
        WHERE
          ${studentLessonsProgress.studentId} = ${userId}
          AND ${studentLessonsProgress.completedAt} IS NOT NULL
          AND ${studentLessonsProgress.completedAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY
          date_trunc('month',
            ${studentLessonsProgress.completedAt})
      ),
      month_stats AS (
        SELECT
          to_char(date_trunc('month', ${studentLessonsProgress.createdAt}), 'YYYY-MM') AS month,
          COUNT(DISTINCT ${studentLessonsProgress.lessonId})::INTEGER AS started,
          (CASE WHEN completed_lessons.month IS NOT NULL THEN completed_lessons.completed_lessons_count ELSE 0 END)::INTEGER AS completed
        FROM
          ${studentLessonsProgress}
          LEFT JOIN ${lessons} ON ${studentLessonsProgress.lessonId} = ${lessons.id}
          LEFT JOIN completed_lessons ON date_trunc('month', ${studentLessonsProgress.createdAt}) = completed_lessons.month
        WHERE
          ${studentLessonsProgress.studentId} = ${userId}
          AND ${studentLessonsProgress.createdAt} >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY
          date_trunc('month', ${studentLessonsProgress.createdAt}), completed_lessons.month, completed_lessons.completed_lessons_count
        ORDER BY
          date_trunc('month', ${studentLessonsProgress.createdAt})
      )
      SELECT
        month_stats.month AS month,
        month_stats.started AS started,
        month_stats.completed AS completed,
        COALESCE(ROUND((month_stats.completed::NUMERIC / NULLIF(month_stats.started::NUMERIC, 0)) * 100, 2)::INTEGER, 0) AS "completionRate"
      FROM
        month_stats
      `);
  }

  async getActivityStats(userId: string) {
    const [result] = await this.db
      .select({
        currentStreak: userStatistics.currentStreak,
        longestStreak: userStatistics.longestStreak,
        lastActivityDate: userStatistics.lastActivityDate,
        activityHistory: userStatistics.activityHistory,
      })
      .from(userStatistics)
      .where(eq(userStatistics.userId, userId));
    return result;
  }

  async createQuizAttempt(data: {
    userId: string;
    courseId: string;
    lessonId: string;
    correctAnswers: number;
    wrongAnswers: number;
    score: number;
  }) {
    return this.db.insert(quizAttempts).values(data);
  }

  async upsertUserStatistic(userId: string, upsertUserStatistic: UserStatistic) {
    await this.db
      .insert(userStatistics)
      .values({
        userId,
        ...upsertUserStatistic,
      })
      .onConflictDoUpdate({
        target: userStatistics.userId,
        set: {
          ...upsertUserStatistic,
        },
      });
  }
}
