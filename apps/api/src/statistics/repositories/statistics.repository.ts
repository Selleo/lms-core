import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LessonProgress } from "src/lessons/schemas/lesson.types";
import {
  courses,
  coursesSummaryStats,
  courseStudentsStats,
  lessons,
  quizAttempts,
  studentCourses,
  studentLessonsProgress,
  userStatistics,
} from "src/storage/schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { StatsByMonth, UserStatistic } from "src/statistics/schemas/userStats.schema";
import type * as schema from "src/storage/schema";

@Injectable()
export class StatisticsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getQuizStats(userId: string) {
    const [quizStatsResult] = await this.db
      .select({
        totalAttempts: sql<number>`count(*) :: INTEGER`,
        totalCorrectAnswers: sql<number>`coalesce(SUM(${quizAttempts.correctAnswers}), 0) :: INTEGER`,
        totalWrongAnswers: sql<number>`coalesce(SUM(${quizAttempts.wrongAnswers}), 0) :: INTEGER`,
        totalQuestions: sql<number>`coalesce(SUM(${quizAttempts.correctAnswers} + ${quizAttempts.wrongAnswers}), 0) :: INTEGER`,
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
        COALESCE(ROUND((month_stats.completed::NUMERIC / NULLIF(month_stats.started::NUMERIC, 0)) * 100, 2), 0)::INTEGER AS "completionRate"
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
        COALESCE(ROUND((month_stats.completed::NUMERIC / NULLIF(month_stats.started::NUMERIC, 0)) * 100, 2), 0)::INTEGER AS "completionRate"
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

  async getFiveMostPopularCourses(userId: string) {
    return this.db
      .select({
        courseName: courses.title,
        studentCount: sql<number>`${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}`,
      })
      .from(coursesSummaryStats)
      .innerJoin(courses, eq(coursesSummaryStats.courseId, courses.id))
      .where(eq(courses.authorId, userId))
      .orderBy(
        sql`${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount} DESC`,
      )
      .limit(5);
  }

  async getTotalCoursesCompletion(userId: string) {
    return this.db
      .select({
        totalCoursesCompletion: sql<number>`COALESCE(SUM(${coursesSummaryStats.completedCourseStudentCount}), 0)::INTEGER`,
        totalCourses: sql<number>`COALESCE(SUM(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount}), 0)::INTEGER`,
        completionPercentage: sql<number>`(SUM(${coursesSummaryStats.completedCourseStudentCount})::DECIMAL / (SUM(${coursesSummaryStats.freePurchasedCount} + ${coursesSummaryStats.paidPurchasedCount})) * 100)::INTEGER`,
      })
      .from(coursesSummaryStats)
      .where(eq(coursesSummaryStats.authorId, userId));
  }

  async getConversionAfterFreemiumLesson(userId: string) {
    return this.db
      .select({
        purchasedCourses: sql<number>`COALESCE(SUM(${coursesSummaryStats.paidPurchasedAfterFreemiumCount}), 0)::INTEGER`,
        remainedOnFreemium: sql<number>`COALESCE(SUM(${coursesSummaryStats.completedFreemiumStudentCount} - ${coursesSummaryStats.paidPurchasedAfterFreemiumCount}), 0)::INTEGER`,
        conversionPercentage: sql<number>`COALESCE(SUM(${coursesSummaryStats.paidPurchasedAfterFreemiumCount})::DECIMAL / SUM(${coursesSummaryStats.completedFreemiumStudentCount}) * 100, 0)::INTEGER`,
      })
      .from(coursesSummaryStats)
      .where(eq(coursesSummaryStats.authorId, userId));
  }

  async getCourseStudentsStats(userId: string) {
    return this.db
      .select({
        month: sql<string>`${courseStudentsStats.year} || '-' || ${courseStudentsStats.month}+1`,
        newStudentsCount: sql<number>`SUM(${courseStudentsStats.newStudentsCount})::INTEGER`,
      })
      .from(courseStudentsStats)
      .where(eq(courseStudentsStats.authorId, userId))
      .groupBy(courseStudentsStats.month, courseStudentsStats.year)
      .orderBy(desc(courseStudentsStats.month), desc(courseStudentsStats.year))
      .limit(12);
  }

  async getAvgQuizScore(userId: string) {
    return this.db
      .select({
        correctAnswersCount: sql<number>`COALESCE(SUM(${quizAttempts.correctAnswers}), 0)::INTEGER`,
        wrongAnswersCount: sql<number>`COALESCE(SUM(${quizAttempts.wrongAnswers}), 0)::INTEGER`,
      })
      .from(quizAttempts)
      .innerJoin(courses, eq(quizAttempts.courseId, courses.id))
      .where(eq(courses.authorId, userId));
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

  async updateFreePurchasedCoursesStats(courseId: string, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .update(coursesSummaryStats)
      .set({
        freePurchasedCount: sql<number>`${coursesSummaryStats.freePurchasedCount} + 1`,
      })
      .where(eq(coursesSummaryStats.courseId, courseId));
  }

  async updatePaidPurchasedCoursesStats(courseId: string, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .update(coursesSummaryStats)
      .set({
        paidPurchasedCount: sql<number>`${coursesSummaryStats.paidPurchasedCount} + 1`,
      })
      .where(eq(coursesSummaryStats.courseId, courseId));
  }

  async updatePaidPurchasedAfterFreemiumCoursesStats(
    courseId: string,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .update(coursesSummaryStats)
      .set({
        paidPurchasedCount: sql<number>`${coursesSummaryStats.paidPurchasedCount} + 1`,
        paidPurchasedAfterFreemiumCount: sql<number>`${coursesSummaryStats.paidPurchasedAfterFreemiumCount} + 1`,
      })
      .where(eq(coursesSummaryStats.courseId, courseId));
  }

  async updateCompletedAsFreemiumCoursesStats(
    courseId: string,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    return dbInstance
      .update(coursesSummaryStats)
      .set({
        completedFreemiumStudentCount: sql<number>`${coursesSummaryStats.completedFreemiumStudentCount} + 1`,
      })
      .where(eq(coursesSummaryStats.courseId, courseId));
  }

  async calculateCoursesStudentsStats(startDate: string, endDate: string) {
    return this.db
      .select({
        courseId: studentCourses.courseId,
        newStudentsCount: sql<number>`COUNT(*)`,
      })
      .from(studentCourses)
      .where(
        and(
          gte(studentCourses.createdAt, sql`${startDate}::TIMESTAMP`),
          lt(studentCourses.createdAt, sql`${endDate}::TIMESTAMP`),
        ),
      )
      .groupBy(studentCourses.courseId);
  }
}
