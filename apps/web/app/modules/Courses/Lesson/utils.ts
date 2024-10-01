import type { GetLessonResponse } from "~/api/generated-api";
import type { QuestionContent, TQuestionsForm } from "./types";

export const getSummaryItems = (lesson: GetLessonResponse["data"]) => {
  const lessonItems = lesson.lessonItems;

  return lessonItems
    .filter((item) => item.lessonItemType !== "text_block")
    .map((lessonItem) => {
      if ("title" in lessonItem.content) {
        return {
          title: lessonItem.content.title,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.id,
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
    .map((item) => item.content) as QuestionContent[];

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
  questions: QuestionContent[]
): Record<string, Record<string, string>> =>
  questions.reduce(
    (acc, question) => {
      acc[question.id] = question.questionAnswers.reduce(
        (innerAcc, item) => {
          innerAcc[item.id] = item.isStudentAnswer ? `${item.id}` : "";
          return innerAcc;
        },
        {} as Record<string, string>
      );
      return acc;
    },
    {} as Record<string, Record<string, string>>
  );

const prepareOpenQuestions = (questions: QuestionContent[]) =>
  questions.reduce(
    (acc, question) => {
      const studentAnswer = question.questionAnswers?.[0]?.optionText;
      const isStudentAnswer = question.questionAnswers?.[0]?.isStudentAnswer;
      acc[question.id] = isStudentAnswer
        ? (studentAnswer as unknown as string)
        : "";
      return acc;
    },
    {} as Record<string, string>
  );
