export enum QuestionIcons {
  MultiSelect = "MultiSelect",
  SingleSelect = "SingleSelect",
  TrueOrFalse = "TrueOrFalse",
  BriefResponse = "BriefResponse",
  DetailedResponse = "DetailedResponse",
  PhotoQuestion = "PhotoQuestion",
  FillInTheBlanks = "FillInTheBlanks",
}

export type PhotoQuestionType = "single_choice" | "multiple_choice";

export type QuestionOption = {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
};

export type Question = {
  id?: string;
  type: QuestionType;
  description?: string;
  photoS3Key?: string;
  photoS3SingedUrl?: string;
  displayOrder: number;
  photoQuestionType?: PhotoQuestionType;
  title: string;
  options?: QuestionOption[];
};

export enum QuestionType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_OR_FALSE = "true_or_false",
  BRIEF_RESPONSE = "brief_response",
  DETAILED_RESPONSE = "detailed_response",
  PHOTO_QUESTION = "photo_question",
  FILL_IN_THE_BLANKS = "fill_in_the_blanks",
}
