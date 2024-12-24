import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { match } from "ts-pattern";

import { CourseStartedEvent, QuizCompletedEvent, UserActivityEvent } from "src/events";


import type { IEventHandler } from "@nestjs/cqrs";

type StatisticsEvent = QuizCompletedEvent | UserActivityEvent | CourseStartedEvent;

@Injectable()
@EventsHandler(QuizCompletedEvent, UserActivityEvent, CourseStartedEvent)
export class StatisticsHandler implements IEventHandler<QuizCompletedEvent | UserActivityEvent> {
  constructor() {} // private readonly statisticsService: StatisticsService

  async handle(event: StatisticsEvent) {
    try {
      match(event)
        .when(
          (e): e is QuizCompletedEvent => e instanceof QuizCompletedEvent,
          async (quizEvent) => {
            await this.handleQuizCompleted(quizEvent);
          },
        )
        .when(
          (e): e is UserActivityEvent => e instanceof UserActivityEvent,
          async (activityEvent) => {
            await this.handleUserActivity(activityEvent);
          },
        )
        .otherwise(() => {
          throw new Error("Unknown event type");
        });
    } catch (error) {
      console.error("Error handling event:", error);
    }
  }

  // TODO: repair this

  private async handleQuizCompleted(event: QuizCompletedEvent) {
    // await this.statisticsService.createQuizAttempt({
    //   userId: event.userId,
    //   courseId: event.courseId,
    //   lessonId: event.lessonId,
    //   correctAnswers: event.correctAnswers,
    //   wrongAnswers: event.wrongAnswers,
    //   score: event.score,
    // });
  }

  private async handleUserActivity(event: UserActivityEvent) {
    // await this.statisticsService.updateUserActivity(event.userId);
  }
}
