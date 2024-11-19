export type UserActivityType = "LOGIN" | "LESSON_PROGRESS" | "COURSE_PROGRESS";

export class UserActivityEvent {
  constructor(
    public readonly userId: string,
    public readonly activityType: UserActivityType,
    public readonly metadata?: Record<string, any>,
  ) {}
}
