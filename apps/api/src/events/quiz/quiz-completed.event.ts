export class QuizCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly courseId: string,
    public readonly lessonId: string,
    public readonly correctAnswers: number,
    public readonly wrongAnswers: number,
    public readonly score: number,
  ) {}
}
