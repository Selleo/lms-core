import { UUIDType } from "src/common";

export class LessonCompletedEvent {
  constructor(
    public readonly userId: UUIDType,
    public readonly courseId: UUIDType,
    public readonly lessonId: UUIDType,
  ) {}
}
