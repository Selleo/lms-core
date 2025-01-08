import type { GetLessonByIdResponse } from "~/api/generated-api";

export type QuizQuestion = NonNullable<
  GetLessonByIdResponse["data"]["quizDetails"]
>["questions"][number];

export type QuizQuestionOption = NonNullable<QuizQuestion["options"]>[number];
