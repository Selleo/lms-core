export const QUESTION_TYPE = {
  open_answer: { key: "open_answer", value: "Open Answer" },
  single_choice: { key: "single_choice", value: "Single Choice" },
  multiple_choice: { key: "multiple_choice", value: "Multiple Choice" },
  fill_in_the_blanks_text: {
    key: "fill_in_the_blanks_text",
    value: "Fill in the blanks text",
  },
  fill_in_the_blanks_dnd: {
    key: "fill_in_the_blanks_dnd",
    value: "Fill in the blanks drag and drop",
  },
} as const;

export const QUESTION_TYPE_KEYS = Object.fromEntries(
  Object.entries(QUESTION_TYPE).map(([key, { value }]) => [key, value]),
) as {
  [K in keyof typeof QUESTION_TYPE]: (typeof QUESTION_TYPE)[K]["value"];
};

export type QuestionTypes = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE]["key"];
