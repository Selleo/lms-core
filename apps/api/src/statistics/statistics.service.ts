import { Injectable } from "@nestjs/common";
import { differenceInDays, eachDayOfInterval, format, startOfDay } from "date-fns";

import { LessonsRepository } from "src/lessons/repositories/lessons.repository";
import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import type { StatsByMonth, UserStats } from "./schemas/userStats.schema";

@Injectable()
export class StatisticsService {
  constructor(
    private statisticsRepository: StatisticsRepository,
    private lessonsRepository: LessonsRepository,
  ) {}

  async getUserStats(userId: string): Promise<UserStats> {
    const coursesStatsByMonth: StatsByMonth[] =
      await this.statisticsRepository.getCoursesStatsByMonth(userId);
    const coursesTotalStats = this.calculateTotalStats(coursesStatsByMonth);

    const lessonsStatsByMonth: StatsByMonth[] =
      await this.statisticsRepository.getLessonsStatsByMonth(userId);
    const lessonsTotalStats = this.calculateTotalStats(lessonsStatsByMonth);

    const quizStats = await this.statisticsRepository.getQuizStats(userId);

    const lastLesson = await this.getLassLesson(userId);

    const activityStats = await this.statisticsRepository.getActivityStats(userId);

    return {
      courses: this.formatStats(coursesStatsByMonth),
      lessons: this.formatStats(lessonsStatsByMonth),
      quizzes: {
        totalAttempts: quizStats.totalAttempts,
        totalCorrectAnswers: quizStats.totalCorrectAnswers,
        totalWrongAnswers: quizStats.totalWrongAnswers,
        totalQuestions: quizStats.totalQuestions,
        averageScore: quizStats.averageScore,
        uniqueQuizzesTaken: quizStats.uniqueQuizzesTaken,
      },
      averageStats: {
        lessonStats: lessonsTotalStats,
        courseStats: coursesTotalStats,
      },
      lastLesson,
      streak: {
        current: activityStats.currentStreak ?? 0,
        longest: activityStats.longestStreak ?? 0,
        activityHistory: activityStats?.activityHistory || {},
      },
    };
  }

  async getTeacherStats(userId: string) {
    const fiveMostPopularCourses =
      await this.statisticsRepository.getFiveMostPopularCourses(userId);
    const [totalCoursesCompletionStats] =
      await this.statisticsRepository.getTotalCoursesCompletion(userId);
    const [conversionAfterFreemiumLesson] =
      await this.statisticsRepository.getConversationAfterFreemiumLesson(userId);

    return {
      fiveMostPopularCourses,
      totalCoursesCompletionStats,
      conversionAfterFreemiumLesson,
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
    await this.statisticsRepository.createQuizAttempt(data);
  }

  async updateUserActivity(userId: string) {
    const today = startOfDay(new Date());
    const formatedTodayDate = format(today, "yyyy-MM-dd");

    const currentStats = await this.statisticsRepository.getActivityStats(userId);

    const lastActivityDate = currentStats?.lastActivityDate
      ? startOfDay(new Date(currentStats.lastActivityDate))
      : null;

    const newCurrentStreak = (() => {
      if (!lastActivityDate) return 1;

      const daysDiff = differenceInDays(today, lastActivityDate);

      switch (daysDiff) {
        case 0:
          return currentStats?.currentStreak ?? 1;
        case 1:
          return (currentStats?.currentStreak ?? 0) + 1;
        default:
          return 1;
      }
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

    await this.statisticsRepository.upsertUserStatistic(userId, {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: today,
      activityHistory: newActivityHistory,
    });
  }

  private calculateTotalStats(coursesStatsByMonth: StatsByMonth[]) {
    const totalStats = coursesStatsByMonth.reduce(
      (acc, curr) => {
        acc.started += curr.started;
        acc.completed += curr.completed;
        return acc;
      },
      { started: 0, completed: 0, completionRate: 0 },
    );

    totalStats.completionRate =
      totalStats.started > 0 ? Math.round((totalStats.completed / totalStats.started) * 100) : 0;

    return totalStats;
  }

  private formatStats = (stats: StatsByMonth[]) => {
    const monthlyStats: { [key: string]: Omit<StatsByMonth, "month"> } = {};

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

    for (const stat of stats) {
      const month = format(new Date(stat.month), "MMMM");
      monthlyStats[month] = {
        started: stat.started,
        completed: stat.completed,
        completionRate: stat.completionRate,
      };
    }

    return monthlyStats;
  };

  private async getLassLesson(userId: string) {
    const lastLessonItem =
      await this.lessonsRepository.getLastInteractedOrNextLessonItemForUser(userId);

    if (!lastLessonItem) return null;

    const [lastLessonDetails] = await this.lessonsRepository.getLessonsDetails(
      userId,
      lastLessonItem.courseId,
      lastLessonItem.lessonId,
    );
    const lastLessonUserDetails = await this.lessonsRepository.getLessonForUser(
      lastLessonItem.courseId,
      lastLessonItem.lessonId,
      userId,
    );

    return {
      ...lastLessonDetails,
      enrolled: lastLessonUserDetails.enrolled,
      courseId: lastLessonItem.courseId,
      courseTitle: lastLessonItem.courseTitle,
      courseDescription: lastLessonItem.courseDescription,
    };
  }
}
