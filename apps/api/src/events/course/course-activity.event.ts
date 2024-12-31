import { UUIDType } from "src/common";

export class CourseStartedEvent {
  constructor(
    public readonly userId: UUIDType,
    public readonly courseId: UUIDType,
  ) {}
}

export class CourseCompletedEvent {
  constructor(
    public readonly userId: UUIDType,
    public readonly courseId: UUIDType,
  ) {}
}
