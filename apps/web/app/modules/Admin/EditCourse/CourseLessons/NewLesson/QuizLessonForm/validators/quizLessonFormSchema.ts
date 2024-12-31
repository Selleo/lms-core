import { z } from "zod";
import { QuestionType } from "../QuizLessonForm.types";

export const quizLessonFormSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        id: z.optional(z.string()),
        type: z.nativeEnum(QuestionType),
        description: z.optional(
          z.string().min(10, "Question body must be at least 10 characters."),
        ),
        photoS3Key: z.optional(z.string()),
        displayOrder: z.number(),
        thumbnailS3: z.optional(
          z.object({
            value: z.string(),
            key: z.string(),
          }),
        ),
        photoQuestionType: z.optional(z.enum(["single_choice", "multiple_choice"])),
        title: z.string(),
        options: z
          .array(
            z.object({
              id: z.optional(z.string()),
              optionText: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
              displayOrder: z.number(),
              matchedWord: z.optional(z.string()),
              scaleAnswer: z.optional(z.number()),
            }),
          )
          .optional(),
      }),
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (
            question.type !== QuestionType.BRIEF_RESPONSE &&
            question.type !== QuestionType.DETAILED_RESPONSE
          ) {
            return Array.isArray(question.options) && question.options.length > 0;
          }
          return true;
        });
      },
      {
        message: "At least one option is required.",
        path: ["options"],
      },
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (question.type === QuestionType.PHOTO_QUESTION) {
            return !!question.photoS3Key;
          }

          return true;
        });
      },
      {
        message: "Image is required.",
        path: ["image"],
      },
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (
            question.type === QuestionType.SINGLE_CHOICE ||
            question.photoQuestionType === QuestionType.SINGLE_CHOICE
          ) {
            return (
              Array.isArray(question.options) &&
              question.options.some((option) => option.isCorrect === true)
            );
          }
          return true;
        });
      },
      {
        message: "At least one option must be marked as correct for single choice questions.",
        path: ["options"],
      },
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (
            question.type === QuestionType.MULTIPLE_CHOICE ||
            question.photoQuestionType === QuestionType.MULTIPLE_CHOICE
          ) {
            const correctOptions = question.options?.filter((option) => option.isCorrect);
            if (correctOptions) {
              return correctOptions?.length >= 2;
            }
          }
          return true;
        });
      },
      {
        message: "At least two options must be marked as correct for multiple choice questions.",
        path: ["options"],
      },
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (
            question.type === QuestionType.FILL_IN_THE_BLANKS_DND ||
            question.type === QuestionType.FILL_IN_THE_BLANKS_TEXT
          ) {
            const allOptionsCorrect = question.options?.every(
              (option) => option.isCorrect === true,
            );
            return allOptionsCorrect ?? true;
          }

          return true;
        });
      },
      {
        message: "All options must be correct for fill-in-the-blank questions.",
        path: ["options"],
      },
    )
    .refine(
      (questions) => {
        return questions.every((question) => {
          if (question.type === QuestionType.SCALE_1_5) {
            const allOptionsHaveScaleAnswer = question.options?.every(
              (option) => option.scaleAnswer !== undefined,
            );
            if (!allOptionsHaveScaleAnswer) {
              return false;
            }
          }

          return true;
        });
      },
      {
        message: "All options must have a scale answer",
        path: ["options"],
      },
    ),
});

export type QuizLessonFormValues = z.infer<typeof quizLessonFormSchema>;
