import { GetLessonResponse } from "~/api/generated-api";

export type TQuestionsForm = {
  openQuestions: {
    [key: string]: string;
  };
  singleAnswerQuestions: {
    [key: string]: string;
  };
  multiAnswerQuestions: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
};

export type LessonItem = GetLessonResponse["data"]["lessonItems"][number];
export type Content = LessonItem["content"];

type ExtractQuestionContent<T> = T extends { questionAnswers: infer QA }
  ? T & { questionAnswers: QA }
  : never;

export type QuestionContent = ExtractQuestionContent<Content>;