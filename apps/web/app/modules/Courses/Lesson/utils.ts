import type { GetLessonResponse } from "~/api/generated-api";
import type { QuestionContent, TQuestionsForm } from "./types";

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
    .map((item) => item.content as QuestionContent);

  const singleQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "single_choice"
  );

  const multiQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "multiple_choice"
  );

  const openQuestionsFromApi = allQuestions.filter(
    (question) => question.questionType === "open_answer"
  );

  const singleAnswerQuestions = prepareSingleQuestions(singleQuestionsFromApi);
  const multiAnswerQuestions = prepareMultiQuestions(multiQuestionsFromApi);
  const openQuestions = prepareOpenQuestions(openQuestionsFromApi);

  return {
    openQuestions,
    singleAnswerQuestions,
    multiAnswerQuestions,
  };
};

const prepareSingleQuestions = (
  questions: QuestionContent[]
): { [key: string]: string } =>
  questions.reduce(
    (acc, question) => {
      const selectedAnswer = question.questionAnswers.find(
        (answer) => answer.isStudentAnswer
      );
      acc[question.id] = selectedAnswer ? selectedAnswer.id : "";
      return acc;
    },
    {} as { [key: string]: string }
  );

const prepareMultiQuestions = (
  questions: QuestionContent[]
): { [key: string]: { [key: string]: boolean } } =>
  questions.reduce(
    (acc, question) => {
      acc[question.id] = {};
      question.questionAnswers.forEach((answer) => {
        acc[question.id][answer.id] = answer.isStudentAnswer || false;
      });
      return acc;
    },
    {} as { [key: string]: { [key: string]: boolean } }
  );

const prepareOpenQuestions = (
  questions: QuestionContent[]
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
