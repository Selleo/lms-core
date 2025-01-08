// TODO: to remove and use QuestionType from lesson type
export const QUESTION_TYPE = {
  brief_response: { key: "brief_response", value: "Brief Response" },
  detailed_response: { key: "detailed_response", value: "Detailed Response" },
  match_words: { key: "match_words", value: "Match Words" },
  scale_1_5: { key: "scale_1_5", value: "Scale 1 to 5" },
  single_choice: { key: "single_choice", value: "Single Choice" },
  multiple_choice: { key: "multiple_choice", value: "Multiple Choice" },
  true_or_false: { key: "true_or_false", value: "True or False" },
  photo_question: { key: "photo_question", value: "Photo Question" },
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
