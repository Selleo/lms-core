import { Inject, Injectable } from "@nestjs/common";
import { startOfDay, differenceInDays, eachDayOfInterval, format } from "date-fns";
import { and, eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";

import {
  quizAttempts,
  studentCourses,
  studentLessonsProgress,
  userStatistics,
} from "../../storage/schema";

type Stats = {
  month: string;
  started: number;
  completed: number;
  completionRate: number;
};

@Injectable()
export class StatisticsRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getUserStats(userId: string) {
    const [quizStatsResult] = await this.db
      .select({
        totalAttempts: sql<number>`count(*)`,
        totalCorrectAnswers: sql<number>`coalesce(sum(${quizAttempts.correctAnswers}), 0)`,
        totalWrongAnswers: sql<number>`coalesce(sum(${quizAttempts.wrongAnswers}), 0)`,
        totalQuestions: sql<number>`coalesce(sum(${quizAttempts.correctAnswers} + ${quizAttempts.wrongAnswers}), 0)`,
        averageScore: sql<number>`coalesce(round(avg(${quizAttempts.score}), 2), 0)`,
        uniqueQuizzesTaken: sql<number>`count(distinct ${quizAttempts.lessonId})`,
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .groupBy(quizAttempts.userId);

    const quizStats = quizStatsResult || {
      totalAttempts: 0,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalQuestions: 0,
      averageScore: 0,
      uniqueQuizzesTaken: 0,
    };

    const courseStatsResult = await this.db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${studentCourses.createdAt}), 'YYYY-MM')`,
        started: sql<number>`count(*)`,
        completed: sql<number>`count(case when ${studentCourses.state} = 'completed' then 1 end)`,
        completionRate: sql<number>`
        coalesce(
          round(
            (count(case when ${studentCourses.state} = 'completed' then 1 end)::numeric /
            nullif(count(*)::numeric, 0)) * 100,
            2
          ),
          0
        )
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

    const [activityStats] = await this.db
      .select()
      .from(userStatistics)
      .where(eq(userStatistics.userId, userId));

    const lessonStatsResult = await this.db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${studentLessonsProgress.createdAt}), 'YYYY-MM')`,
        started: sql<number>`count(distinct ${studentLessonsProgress.lessonId})`,
        completed: sql<number>`count(case when ${studentLessonsProgress.completedLessonItemCount} = ${studentLessonsProgress.lessonItemCount} then 1 end)`,
        completionRate: sql<number>`
          coalesce(
            round(
              (count(case when ${studentLessonsProgress.completedLessonItemCount} = ${studentLessonsProgress.lessonItemCount} then 1 end)::numeric /
              nullif(count(distinct ${studentLessonsProgress.lessonId})::numeric, 0)) * 100,
              2
            ),
            0
          )
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

    return {
      quizzes: {
        totalAttempts: Number(quizStats.totalAttempts),
        totalCorrectAnswers: Number(quizStats.totalCorrectAnswers),
        totalWrongAnswers: Number(quizStats.totalWrongAnswers),
        totalQuestions: Number(quizStats.totalQuestions),
        averageScore: Number(quizStats.averageScore),
        uniqueQuizzesTaken: Number(quizStats.uniqueQuizzesTaken),
      },
      courses: this.formatCourseStats(courseStatsResult),
      streak: {
        current: Number(activityStats?.currentStreak) || 0,
        longest: Number(activityStats?.longestStreak) || 0,
        activityHistory: activityStats?.activityHistory || {},
      },
      lessons: this.formatLessonStats(lessonStatsResult),
    };
  }

  async createQuizAttempt(data: {
    userId: string;
    courseId: string;
    lessonId: string;
    correctAnswers: number;
    wrongAnswers: number;
    score: number;
  }) {
    return await this.db.insert(quizAttempts).values(data);
  }

  async updateUserActivity(userId: string) {
    const today = startOfDay(new Date());
    const formatedTodayDate = format(today, "yyyy-MM-dd");

    const [currentStats] = await this.db
      .select({
        currentStreak: userStatistics.currentStreak,
        longestStreak: userStatistics.longestStreak,
        lastActivityDate: userStatistics.lastActivityDate,
        activityHistory: userStatistics.activityHistory,
      })
      .from(userStatistics)
      .where(eq(userStatistics.userId, userId));

    const lastActivityDate = currentStats?.lastActivityDate
      ? startOfDay(new Date(currentStats.lastActivityDate))
      : null;

    const newCurrentStreak = (() => {
      if (!lastActivityDate) return 1;

      const daysDiff = differenceInDays(today, lastActivityDate);

      if (daysDiff === 0) return currentStats?.currentStreak ?? 1;
      if (daysDiff === 1) return (currentStats?.currentStreak ?? 0) + 1;
      return 1;
    })();

    const newLongestStreak = Math.max(newCurrentStreak, currentStats?.longestStreak ?? 0);

    const isUserLoggedInToday = currentStats?.activityHistory?.[formatedTodayDate] ?? false;
    if (isUserLoggedInToday) {
      return;
    }

    const dateRange = lastActivityDate
      ? eachDayOfInterval({ start: lastActivityDate, end: today })
      : [today];

    const newActivityHistory = dateRange.reduce(
      (acc, date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        if (!acc[dateStr]) {
          acc[dateStr] = dateStr === formatedTodayDate;
        }
        return acc;
      },
      { ...(currentStats?.activityHistory ?? {}) },
    );

    await this.db
      .insert(userStatistics)
      .values({
        userId,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
        activityHistory: newActivityHistory,
      })
      .onConflictDoUpdate({
        target: userStatistics.userId,
        set: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: today,
          activityHistory: newActivityHistory,
        },
      });
  }

  private formatCourseStats = (courseStats: Stats[]) => {
    const monthlyStats: { [key: string]: Omit<Stats, "month"> } = {};

    const currentDate = new Date();
    for (let index = 11; index >= 0; index--) {
      const month = format(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1),
        "MMMM",
      );
      monthlyStats[month] = {
        started: 0,
        completed: 0,
        completionRate: 0,
      };
    }

    for (const stat of courseStats) {
      const month = format(new Date(stat.month), "MMMM");
      monthlyStats[month] = {
        started: Number(stat.started),
        completed: Number(stat.completed),
        completionRate: Number(stat.completionRate),
      };
    }

    return monthlyStats;
  };

  private formatLessonStats = (lessonStats: Stats[]) => {
    const monthlyStats: { [key: string]: Omit<Stats, "month"> } = {};

    const currentDate = new Date();
    for (let index = 11; index >= 0; index--) {
      const month = format(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1),
        "MMMM",
      );
      monthlyStats[month] = {
        started: 0,
        completed: 0,
        completionRate: 0,
      };
    }

    for (const stat of lessonStats) {
      const month = format(new Date(stat.month), "MMMM");
      monthlyStats[month] = {
        started: Number(stat.started),
        completed: Number(stat.completed),
        completionRate: Number(stat.completionRate),
      };
    }

    return monthlyStats;
  };
}
