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
  PhotoQuestionSingleChoice = "photo_question_single_choice",
  PhotoQuestionMultipleChoice = "photo_question_multiple_choice",
  FillInTheBlanksText = "fill_in_the_blanks_text",
  FillInTheBlanksDnd = "fill_in_the_blanks_dnd",
  BriefResponse = "brief_response",
  DetailedResponse = "detailed_response",
  MatchWords = "match_words",
  Scale_1_5 = "scale_1_5",
}

export type LessonTypes = (typeof LESSON_TYPES)[keyof typeof LESSON_TYPES];
