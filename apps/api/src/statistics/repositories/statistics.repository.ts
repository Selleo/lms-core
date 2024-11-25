import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { quizAttempts, studentCourses, userStatistics } from "src/storage/schema";

import type { StatsByMonth, UserStatistic } from "src/statistics/schemas/userStats.schema";

@Injectable()
export class StatisticsRepository {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

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

  async getCoursesStatsByMonth(userId: string) {
    return this.db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${studentCourses.createdAt}), 'YYYY-MM')`,
        started: sql<number>`count(*) :: INTEGER`,
        completed: sql<number>`count(case when ${studentCourses.state} = 'completed' then 1 end) :: INTEGER`,
        completionRate: sql<number>`
        coalesce(
          round(
            (count(case when ${studentCourses.state} = 'completed' then 1 end)::numeric /
            nullif(count(*)::numeric, 0)) * 100,
            2
          ),
          0
        ) :: INTEGER
      `,
      })
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.studentId, userId),
          sql`${studentCourses.createdAt} >= date_trunc('month', current_date) - interval '11 months'`,
        ),
      )
      .groupBy(sql<string>`date_trunc('month', ${studentCourses.createdAt})`)
      .orderBy(sql<string>`date_trunc('month', ${studentCourses.createdAt})`);
  }

  async getLessonsStatsByMonth(userId: string): Promise<StatsByMonth[]> {
    return this.db.execute(sql`
      WITH completed_lessons AS (
        SELECT
          date_trunc('month',
              student_lessons_progress.completed_date) AS month,
          COUNT(student_lessons_progress.id) AS completed_lessons_count
        FROM
          student_lessons_progress
        WHERE
          student_id = ${userId}
          AND student_lessons_progress.completed_date IS NOT NULL
        GROUP BY
          date_trunc('month',
            student_lessons_progress.completed_date)
      ),
      month_stats AS (
        SELECT
          to_char(date_trunc('month', student_lessons_progress.created_at), 'YYYY-MM') AS month,
          COUNT(DISTINCT student_lessons_progress.lesson_id)::INTEGER AS started,
          (CASE WHEN completed_lessons.month IS NOT NULL THEN completed_lessons.completed_lessons_count ELSE 0 END)::INTEGER AS completed
        FROM
          student_lessons_progress
          LEFT JOIN lessons ON student_lessons_progress.lesson_id = lessons.id
          LEFT JOIN completed_lessons ON date_trunc('month', student_lessons_progress.created_at) = completed_lessons.month
        WHERE
          student_lessons_progress.student_id = ${userId}
          AND student_lessons_progress.created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY
          date_trunc('month', student_lessons_progress.created_at), completed_lessons.month, completed_lessons.completed_lessons_count
        ORDER BY
          date_trunc('month', student_lessons_progress.created_at)
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
