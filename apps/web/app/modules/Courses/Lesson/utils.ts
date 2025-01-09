import type { GetLessonByIdResponse } from "~/api/generated-api";

type Questions = NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"];

export const getUserAnswers = (
  questions: Questions,
): {
  singleAnswerQuestions: Record<string, Record<string, string>>;
  multiAnswerQuestions: Record<string, Record<string, string>>;
  trueOrFalseQuestions: Record<string, Record<string, string>>;
  photoQuestionSingleChoice: Record<string, Record<string, string>>;
  photoQuestionMultipleChoice: Record<string, Record<string, string>>;
  fillInTheBlanksText: Record<string, Record<string, string>>;
  fillInTheBlanksDnd: Record<string, Record<string, string>>;
  matchWords: Record<string, Record<string, string>>;
  scaleQuestions: Record<string, Record<string, string>>;
  briefResponses: Record<string, string>;
} => {
  const groupedQuestions = groupQuestionsByType(questions);

  return {
    singleAnswerQuestions: prepareAnswers(groupedQuestions.single_choice, "options"),
    multiAnswerQuestions: prepareAnswers(groupedQuestions.multiple_choice, "options"),
    trueOrFalseQuestions: prepareAnswers(groupedQuestions.true_or_false, "options"),
    photoQuestionSingleChoice: prepareAnswers(
      groupedQuestions.photo_question_single_choice,
      "options",
    ),
    photoQuestionMultipleChoice: prepareAnswers(
      groupedQuestions.photo_question_multiple_choice,
      "options",
    ),
    fillInTheBlanksText: prepareAnswers(groupedQuestions.fill_in_the_blanks_text, "options"),
    fillInTheBlanksDnd: prepareAnswers(groupedQuestions.fill_in_the_blanks_dnd, "options"),
    matchWords: prepareAnswers(groupedQuestions.match_words, "options"),
    scaleQuestions: prepareAnswers(groupedQuestions.scale_1_5, "options"),
    briefResponses: prepareAnswers(groupedQuestions.brief_response, "open"),
  };
};

const groupQuestionsByType = (questions: Questions) => {
  return {
    single_choice: questions.filter(({ type }) => type === "single_choice"),
    multiple_choice: questions.filter(({ type }) => type === "multiple_choice"),
    true_or_false: questions.filter(({ type }) => type === "true_or_false"),
    photo_question_single_choice: questions.filter(
      ({ type }) => type === "photo_question_single_choice",
    ),
    photo_question_multiple_choice: questions.filter(
      ({ type }) => type === "photo_question_multiple_choice",
    ),
    fill_in_the_blanks_text: questions.filter(({ type }) => type === "fill_in_the_blanks_text"),
    fill_in_the_blanks_dnd: questions.filter(({ type }) => type === "fill_in_the_blanks_dnd"),
    match_words: questions.filter(({ type }) => type === "match_words"),
    scale_1_5: questions.filter(({ type }) => type === "scale_1_5"),
    brief_response: questions.filter(({ type }) => type === "brief_response"),
  };
};

const prepareAnswers = (questions: Questions, mode: "options" | "open"): Record<string, any> => {
  return questions.reduce(
    (result, question) => {
      if (question.type === "true_or_false") {
        result[question.id ?? ""] = question?.options?.reduce(
          (optionMap, option) => {
            optionMap[option.id ?? "0"] = option.isStudentAnswer ? `${option.id}` : "";
            return optionMap;
          },
          {} as Record<string, string>,
        );
      }

      if (question.type === "fill_in_the_blanks_text") {
        result[question.id ?? ""] = question?.options?.map(({ studentAnswer }, index) => {
          return { [`${index + 1}`]: studentAnswer ?? null };
        });
      }

      if (mode === "options") {
        result[question.id ?? ""] = question?.options?.reduce(
          (optionMap, option) => {
            optionMap[option.id ?? "0"] = option.isStudentAnswer ? `${option.id}` : null;
            return optionMap;
          },
          {} as Record<string, string>,
        );
      }

      if (mode === "open") {
        const studentAnswer = question.options?.[0]?.optionText || "";
        const isStudentAnswer = question.options?.[0]?.isStudentAnswer || false;
        result[question.id] = isStudentAnswer ? studentAnswer : "";
      }

      return result;
    },
    mode === "options"
      ? ({} as Record<string, Record<string, string>>)
      : ({} as Record<string, string>),
  );
};
