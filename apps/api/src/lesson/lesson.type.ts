export const LESSON_TYPES = {
  TEXT: "text",
  FILE: "file",
  PRESENTATION: "presentation",
  VIDEO: "video",
  QUIZ: "quiz",
} as const;

export enum QuestionType {
  SingleChoice = "single_choice",
  MultipleChoice = "multiple_choice",
  TrueOrFalse = "true_or_false",
  PhotoQuestion = "photo_question",
  FillInTheBlanks = "fill_in_the_blanks",
  BriefResponse = "brief_response",
  DetailedResponse = "detailed_response",
}

export enum PhotoQuestionType {
  SingleChoice = "single_choice",
  MultipleChoice = "multiple_choice",
}

export type LessonTypes = (typeof LESSON_TYPES)[keyof typeof LESSON_TYPES];
