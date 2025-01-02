import { Injectable } from "@nestjs/common";
import {
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";

import { StatisticsRepository } from "src/statistics/repositories/statistics.repository";

import type {
  CourseStudentsStatsByMonth,
  StatsByMonth,
  UserStats,
} from "./schemas/userStats.schema";
import type { UUIDType } from "src/common";
@Injectable()
export class StatisticsService {
  constructor(
    private readonly statisticsRepository: StatisticsRepository, // private readonly lessonRepository: LessonRepository,
  ) {}

  async getUserStats(userId: UUIDType): Promise<UserStats> {
    const coursesStatsByMonth: StatsByMonth[] =
      await this.statisticsRepository.getCoursesStatsByMonth(userId);
    const coursesTotalStats = this.calculateTotalStats(coursesStatsByMonth);

    const lessonsStatsByMonth: StatsByMonth[] =
      await this.statisticsRepository.getLessonsStatsByMonth(userId);
    const lessonsTotalStats = this.calculateTotalStats(lessonsStatsByMonth);

    const quizStats = await this.statisticsRepository.getQuizStats(userId);
    // TODO: add last lesson or chapter
    // const lastLesson = await this.getLastLesson(userId);
    const activityStats = await this.statisticsRepository.getActivityStats(userId);

    // TODO: add last lesson
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
      // lastLesson,
      lastLesson: null,
      streak: {
        current: activityStats.currentStreak ?? 0,
        longest: activityStats.longestStreak ?? 0,
        activityHistory: activityStats?.activityHistory || {},
      },
    };
  }

  async getTeacherStats(userId: UUIDType) {
    const fiveMostPopularCourses =
      await this.statisticsRepository.getFiveMostPopularCourses(userId);
    const [totalCoursesCompletionStats] =
      await this.statisticsRepository.getTotalCoursesCompletion(userId);
    const [conversionAfterFreemiumLesson] =
      await this.statisticsRepository.getConversionAfterFreemiumLesson(userId);
    const courseStudentsStats = await this.statisticsRepository.getCourseStudentsStats(userId);
    const [avgQuizScore] = await this.statisticsRepository.getAvgQuizScore(userId);

    return {
      fiveMostPopularCourses,
      totalCoursesCompletionStats,
      conversionAfterFreemiumLesson,
      courseStudentsStats: this.formatCourseStudentStats(courseStudentsStats),
      avgQuizScore: {
        correctAnswerCount: avgQuizScore.correctAnswersCount,
        wrongAnswerCount: avgQuizScore.wrongAnswersCount,
        answerCount: avgQuizScore.correctAnswersCount + avgQuizScore.wrongAnswersCount,
      },
    };
  }

  async createQuizAttempt(data: {
    userId: UUIDType;
    courseId: UUIDType;
    lessonId: UUIDType;
    correctAnswers: number;
    wrongAnswers: number;
    score: number;
  }) {
    await this.statisticsRepository.createQuizAttempt(data);
  }

  async updateUserActivity(userId: UUIDType) {
    const today = startOfDay(new Date());
    const formattedTodayDate = format(today, "yyyy-MM-dd");

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

    const isUserLoggedInToday = currentStats?.activityHistory?.[formattedTodayDate] ?? false;
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
          acc[dateStr] = dateStr === formattedTodayDate;
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

  async refreshCourseStudentsStats() {
    const yesterday = subDays(new Date(), 1);
    const startDate = startOfMonth(yesterday).toISOString();
    const endDate = endOfMonth(yesterday).toISOString();

    await this.statisticsRepository.calculateCoursesStudentsStats(startDate, endDate);
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

  private formatCourseStudentStats(stats: CourseStudentsStatsByMonth[]) {
    const monthlyStats: { [key: string]: Omit<CourseStudentsStatsByMonth, "month"> } = {};

    const currentDate = new Date();
    for (let index = 11; index >= 0; index--) {
      const month = format(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1),
        "MMMM",
      );
      monthlyStats[month] = {
        newStudentsCount: 0,
      };
    }

    for (const stat of stats) {
      const month = format(new Date(stat.month), "MMMM");
      monthlyStats[month] = {
        newStudentsCount: stat.newStudentsCount,
      };
    }

    return monthlyStats;
  }

  // private async getLastLesson(userId: UUIDType) {
  //   //TODO: repair this, maybe change on chapter
  //   const lastLesson = await this.lessonRepository.getLastInteractedOrNextLessonItemForUser(userId);
  //   if (!lastLesson) return null;

  //   const [lastLessonDetails] = await this.lessonRepository.getLessonsDetails(
  //     userId,
  //     lastLesson.courseId,
  //     lastLesson.lessonId,
  //   );
  //   const lastLessonUserDetails = await this.lessonRepository.getLessonForUser(
  //     lastLesson.courseId,
  //     lastLesson.lessonId,
  //     userId,
  //   );

  //   return {
  //     ...lastLessonDetails,
  //     enrolled: lastLessonUserDetails.enrolled,
  //     courseId: lastLesson.courseId,
  //     courseTitle: lastLesson.courseTitle,
  //     courseDescription: lastLesson.courseDescription,
  //   };
  // }
}
