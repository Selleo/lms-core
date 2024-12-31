import { UUIDType } from "src/common";

export type UserActivityType = "LOGIN" | "LESSON_PROGRESS" | "COURSE_PROGRESS";

export class UserActivityEvent {
  constructor(
    public readonly userId: UUIDType,
    public readonly activityType: UserActivityType,
    public readonly metadata?: Record<string, any>,
  ) {}
}
