import type { QuestionContent, TQuestionsForm } from "./types";
import type { GetLessonByIdResponse, GetLessonResponse } from "~/api/generated-api";

export const getSummaryItems = (lesson: GetLessonResponse["data"]) => {
  const lessonItems = lesson.lessonItems;

  return lessonItems
    .filter((item) => item.lessonItemType !== "text_block")
    .map((lessonItem) => {
      if ("title" in lessonItem.content) {
        return {
          title: lessonItem.content.title,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.lessonItemId,
          isCompleted: !!lessonItem.isCompleted,
        };
      } else {
        return {
          title: lessonItem.content.questionBody,
          displayOrder: lessonItem.displayOrder,
          id: lessonItem.content.id,
          isCompleted: !!lessonItem.isCompleted,
        };
      }
    })
    .sort((a, b) => a.displayOrder || 0 - (b.displayOrder || 0));
};

export const getOrderedLessons = (lesson: GetLessonResponse["data"]) =>
  lesson.lessonItems.sort((a, b) => a.displayOrder || 0 - (b.displayOrder || 0));

export const getQuestionsArray = (lesson: GetLessonResponse["data"]["lessonItems"]) =>
  lesson.filter((lesson) => lesson.lessonItemType === "question").map((item) => item.content.id);

export const getUserAnswers = (
  questions: NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"],
): TQuestionsForm => {
  const singleQuestionsFromApi = questions.filter((question) => question.type === "single_choice");

  const multiQuestionsFromApi = questions.filter((question) => question.type === "multiple_choice");

  const openQuestionsFromApi = questions.filter((question) =>
    ["brief_response", "detailed_response"].includes(question.type),
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

const prepareQuestions = (questions: QuestionContent[]): Record<string, Record<string, string>> =>
  questions.reduce(
    (acc, question) => {
      acc[question.id] = question.options.reduce(
        (innerAcc, option) => {
          innerAcc[option.id ?? "0"] = option.isstudentanswer ? `${option.id}` : "";
          return innerAcc;
        },
        {} as Record<string, string>,
      );
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  );

const prepareOpenQuestions = (questions: QuestionContent[]) =>
  questions.reduce(
    (acc, question) => {
      const studentAnswer = question.options?.[0]?.optionText;
      const isStudentAnswer = question.options?.[0]?.isstudentanswer;
      acc[question.id] = isStudentAnswer ? (studentAnswer as unknown as string) : "";
      return acc;
    },
    {} as Record<string, string>,
  );
