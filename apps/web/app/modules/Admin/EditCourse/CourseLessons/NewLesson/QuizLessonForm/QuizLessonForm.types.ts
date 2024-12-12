export type QuestionIcons =
  | "MultiSelect"
  | "SingleSelect"
  | "TrueOrFalse"
  | "BriefResponse"
  | "DetailedResponse"
  | "PhotoQuestion"
  | "FillInTheBlanks";

export type Question = {
  questionType:
    | "single_choice"
    | "multiple_choice"
    | "true_or_false"
    | "photo_question"
    | "fill_in_the_blanks"
    | "brief_response"
    | "detailed_response";
  questionBody?: string;
  state: "draft" | "published";
  imageUrl?: string;
  photoQuestionType?: "single_choice" | "multiple_choice";
  questionTitle: string;
  options?: {
    value: string;
    isCorrect: boolean;
    position: number;
  }[];
};
