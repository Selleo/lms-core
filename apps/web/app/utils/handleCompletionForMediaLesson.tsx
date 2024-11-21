export function handleCompletionForMediaLesson(isCompleted: boolean, isQuiz: boolean): boolean {
  return !isCompleted && !isQuiz;
}
