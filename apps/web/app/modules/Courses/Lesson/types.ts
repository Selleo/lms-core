export type TQuestionsForm = {
  briefResponses: {
    [key: string]: string;
  };
  detailedResponses: {
    [key: string]: string;
  };
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
};
