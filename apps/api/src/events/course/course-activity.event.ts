export class CourseStartedEvent {
  constructor(
    public readonly userId: string,
    public readonly courseId: string,
  ) {}
}

export class CourseCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly courseId: string,
  ) {}
}
