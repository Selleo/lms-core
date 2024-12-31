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
  FillInTheBlanksText = "fill_in_the_blanks_text",
  FillInTheBlanksDnd = "fill_in_the_blanks_dnd",
  BriefResponse = "brief_response",
  DetailedResponse = "detailed_response",
  MatchWords = "match_words",
  Scale_1_5 = "scale_1_5",
}

export enum PhotoQuestionType {
  SingleChoice = "single_choice",
  MultipleChoice = "multiple_choice",
}

export type LessonTypes = (typeof LESSON_TYPES)[keyof typeof LESSON_TYPES];
