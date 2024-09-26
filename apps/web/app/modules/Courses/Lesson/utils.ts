import type { GetLessonResponse } from "~/api/generated-api";
import type { TQuestionContent, TQuestionsForm } from "./types";
export const getSummaryItems = (lesson: GetLessonResponse["data"]) => {
  const lessonItems = lesson.lessonItems;
  return lessonItems
    .map((lessonItem) => {
      if ("title" in lessonItem.content) {
        return {
          title: lessonItem.content.title,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.content.id,
        };
      } else {
        return {
          title: lessonItem.content.questionBody,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.content.id,
        };
      }
    })
    .sort((a, b) => a.displayOrder || 0 - (b.displayOrder || 0));
};

export const getOrderedLessons = (lesson: GetLessonResponse["data"]) =>
  lesson.lessonItems.sort(
    (a, b) => a.displayOrder || 0 - (b.displayOrder || 0)
  );

export const getQuestionsArray = (
  lesson: GetLessonResponse["data"]["lessonItems"]
) =>
  lesson
    .filter((lesson) => lesson.lessonItemType === "question")
    .map((item) => item.content.id);

export const getUserAnswers = (
  lesson: GetLessonResponse["data"]
): TQuestionsForm => {
  const allQuestions = lesson.lessonItems
    .filter((lesson) => lesson.lessonItemType === "question")
    .map((item) => item.content as TQuestionContent);

  const singleQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "single_choice"
  );

  const multiQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "multiple_choice"
  );

  const openQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "open_answer"
  );

  const singleAnswerQuestions = prepareQuestions(singleQuestionsFromApi);
  const multiAnswerQuestions = prepareQuestions(multiQuestionsFromApi);
  const openQuestions = prepareOpenQuestions(openQuestionsFromApi);

  return {
    openQuestions,
    singleAnswerQuestions,
    multiAnswerQuestions,
  };
};

const prepareQuestions = (
  questions: TQuestionContent[]
): { [key: string]: string | null } =>
  questions.reduce(
    (acc, question) => {
      acc[question.id] =
        question.questionAnswers.find((answer) => answer.isStudentAnswer)?.id ||
        null;
      return acc;
    },
    {} as { [key: string]: string | null }
  );

const prepareOpenQuestions = (
  questions: TQuestionContent[]
): { [key: string]: string } =>
  questions.reduce(
    (acc, question) => {
      const studentAnswer = question.questionAnswers.find(
        (answer) => answer.isStudentAnswer
      );
      acc[question.id] = studentAnswer ? studentAnswer.optionText : "";
      return acc;
    },
    {} as { [key: string]: string }
  );
