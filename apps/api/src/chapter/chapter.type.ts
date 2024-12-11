export const LESSON_TYPE = {
  quiz: { key: "quiz", value: "Quiz" },
  multimedia: { key: "multimedia", value: "Multimedia" },
} as const;

export const LESSON_ITEM_TYPE = {
  text_block: { key: "text_block", value: "Text Block" },
  file: { key: "file", value: "File" },
  question: { key: "question", value: "Question" },
} as const;

export const LESSON_FILE_TYPE = {
  presentation: { key: "presentation", value: "Presentation" },
  external_presentation: {
    key: "external_presentation",
    value: "External Presentation",
  },
  video: { key: "video", value: "Video" },
  external_video: { key: "external_video", value: "External Video" },
} as const;
