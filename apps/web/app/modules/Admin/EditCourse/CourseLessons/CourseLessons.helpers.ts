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
    .with(QuestionType.SINGLE_CHOICE, () => "singleSelect")
    .with(QuestionType.MULTIPLE_CHOICE, () => "multiSelect")
    .with(QuestionType.TRUE_OR_FALSE, () => "trueOrFalse")
    .with(QuestionType.BRIEF_RESPONSE, () => "briefResponse")
    .with(QuestionType.DETAILED_RESPONSE, () => "detailedResponse")
    .with(QuestionType.PHOTO_QUESTION, () => "photoQuestion")
    .with(QuestionType.FILL_IN_THE_BLANKS_TEXT, () => "fillInTheBlanksText")
    .with(QuestionType.FILL_IN_THE_BLANKS_DND, () => "fillInTheBlanksDragAndDrop")
    .with(QuestionType.MATCH_WORDS, () => "matchWords")
    .with(QuestionType.SCALE_1_5, () => "scale_1_5")
    .otherwise(() => "");
