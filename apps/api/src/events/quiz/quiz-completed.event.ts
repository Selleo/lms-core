import { UUIDType } from "src/common";

export class QuizCompletedEvent {
  constructor(
    public readonly userId: UUIDType,
    public readonly courseId: UUIDType,
    public readonly lessonId: UUIDType,
    public readonly correctAnswers: number,
    public readonly wrongAnswers: number,
    public readonly score: number,
  ) {}
}
