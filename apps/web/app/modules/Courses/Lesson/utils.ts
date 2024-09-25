import isEmpty from "lodash-es/isEmpty";
import type { TAnswerObject, TQuestionsForm } from "./types";

export const normalizedQuestionsData = (
  values: TQuestionsForm,
  lessonId: string
) => {
  const openQuestons = Object.keys(values.openQuestions || {});
  const singleAnswer = Object.keys(values.singleAnswerQuestions || {});
  const multiAnswer = Object.keys(values.multiAnswerQuestions || {});

  const normalizedOpenQuestions = openQuestons.map((question) => ({
    lessonId,
    questionId: question,
    answer: values.openQuestions && values.openQuestions[question],
  }));

  const normalizedSingleAnswerQuestions = singleAnswer.map((question) => ({
    lessonId,
    questionId: question,
    answer:
      values.singleAnswerQuestions &&
      extractAnswearArray(values.singleAnswerQuestions[question]),
  }));

  const normalizedMultiAnswerQuestions = multiAnswer.map((question) => ({
    lessonId,
    questionId: question,
    answer:
      values.multiAnswerQuestions &&
      extractAnswearArray(values.multiAnswerQuestions[question]),
  }));

  return removeEmptyAnswers([
    ...normalizedOpenQuestions,
    ...normalizedSingleAnswerQuestions,
    ...normalizedMultiAnswerQuestions,
  ]);
};

const extractAnswearArray = (answerObject: TAnswerObject) => {
  if (answerObject?.length === 0 || !answerObject) return [];
  return Object.values(answerObject).filter((el) => Boolean(el));
};

const removeEmptyAnswers = (
  answears: {
    lessonId: string;
    questionId: string;
    answer: (string | null)[] | string | undefined;
  }[]
) => answears.filter(({ answer }) => !isEmpty(answer));
