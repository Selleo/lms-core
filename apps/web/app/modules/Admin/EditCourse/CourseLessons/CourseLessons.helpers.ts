import { match } from "ts-pattern";

import { QuestionType } from "~/modules/Admin/EditCourse/CourseLessons/NewLesson/QuizLessonForm/QuizLessonForm.types";

export const mapItemType = (itemType: string | undefined): string =>
  match(itemType)
    .with("text", () => "Text")
    .with("video", () => "Video")
    .with("presentation", () => "Presentation")
    .with("question", () => "Quiz")
    .otherwise(() => "Quiz");

export const mapTypeToIcon = (itemType: string): string =>
  match(itemType)
    .with("text", () => "Text")
    .with("video", () => "Video")
    .with("presentation", () => "Presentation")
    .with("question", () => "Quiz")
    .otherwise(() => "Quiz");

export const mapQuestionTypeToLabel = (questionType: QuestionType): string =>
  match(questionType)
    .with(QuestionType.SINGLE_CHOICE, () => "Single Select")
    .with(QuestionType.MULTIPLE_CHOICE, () => "Multiple Select")
    .with(QuestionType.TRUE_OR_FALSE, () => "True or False")
    .with(QuestionType.BRIEF_RESPONSE, () => "Brief Response")
    .with(QuestionType.DETAILED_RESPONSE, () => "Detailed Response")
    .with(QuestionType.PHOTO_QUESTION, () => "Photo Question")
    .with(QuestionType.FILL_IN_THE_BLANKS_TEXT, () => "Fill in the Blanks text")
    .with(QuestionType.FILL_IN_THE_BLANKS_DND, () => "Fill in the Blanks drag and drop")
    .with(QuestionType.MATCH_WORDS, () => "Match words")
    .with(QuestionType.SCALE_1_5, () => "Scale 1 to 5")
    .otherwise(() => "");
