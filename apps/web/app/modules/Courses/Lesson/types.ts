export type TQuestionsForm = {
  openQuestions?: {
    [key: string]: string;
  };
  singleAnswerQuestions?: {
    [key: string]: string | null;
  };
  multiAnswerQuestions?: {
    [key: string]: string | null;
  };
};

export type TQuestionData = {
  lessonId: string;
  questionId: string;
  answer: string[] | string;
};

export type TAnswerObject =
  | {
      [key: string]: string | null;
    }
  | string
  | null;
