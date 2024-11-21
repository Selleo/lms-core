import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import {
  quizAttempts,
  studentCourses,
  studentLessonsProgress,
  userStatistics,
} from "src/storage/schema";

import type { UserStatistic } from "src/statistics/schemas/userStats.schema";

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

  async getLessonsStatsByMonth(userId: string) {
    return this.db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${studentLessonsProgress.createdAt}), 'YYYY-MM')`,
        started: sql<number>`count(distinct ${studentLessonsProgress.lessonId}) :: INTEGER`,
        completed: sql<number>`count(case when ${studentLessonsProgress.completedLessonItemCount} = ${studentLessonsProgress.lessonItemCount} then 1 end) :: INTEGER`,
        completionRate: sql<number>`
          coalesce(
            round(
              (count(case when ${studentLessonsProgress.completedLessonItemCount} = ${studentLessonsProgress.lessonItemCount} then 1 end)::numeric /
              nullif(count(distinct ${studentLessonsProgress.lessonId})::numeric, 0)) * 100,
              2
            ),
            0
          ) :: INTEGER
        `,
      })
      .from(studentLessonsProgress)
      .where(
        and(
          eq(studentLessonsProgress.studentId, userId),
          sql`${studentLessonsProgress.createdAt} >= date_trunc('month', current_date) - interval '11 months'`,
        ),
      )
      .groupBy(sql<string>`date_trunc('month', ${studentLessonsProgress.createdAt})`)
      .orderBy(sql<string>`date_trunc('month', ${studentLessonsProgress.createdAt})`);
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
