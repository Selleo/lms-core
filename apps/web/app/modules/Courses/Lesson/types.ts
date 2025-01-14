export type QuizForm = {
  briefResponses: Record<string, string>;
  detailedResponses: Record<string, string>;
  singleAnswerQuestions: {
    [key: string]: Record<string, string | null>;
  };
  multiAnswerQuestions: {
    [key: string]: {
      [key: string]: string | null;
    };
  };
  photoQuestionSingleChoice: {
    [key: string]: Record<string, string | null>;
  };
  photoQuestionMultipleChoice: {
    [key: string]: {
      [key: string]: string | null;
    };
  };
  trueOrFalseQuestions: {
    [key: string]: {
      [key: string]: string | null;
    };
  };
  fillInTheBlanksText: {
    [key: string]: {
      [key: string]: string | null;
    };
  };
  fillInTheBlanksDnd: {
    [key: string]: {
      [key: string]: string | null;
    };
  };
};
