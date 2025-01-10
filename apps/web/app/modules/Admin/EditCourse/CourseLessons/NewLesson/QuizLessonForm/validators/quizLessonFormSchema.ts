import { z } from "zod";

import { QuestionType } from "../QuizLessonForm.types";

export const quizLessonFormSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        id: z.optional(z.string()),
        type: z.nativeEnum(QuestionType),
        description: z.optional(z.string()),
        photoS3Key: z.optional(z.string()),
        displayOrder: z.number(),
        thumbnailS3: z.optional(
          z.object({
            value: z.string(),
            key: z.string(),
          }),
        ),
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
    .superRefine((questions, ctx) => {
      questions.forEach((question, index) => {
        if (
          question.type !== QuestionType.BRIEF_RESPONSE &&
          question.type !== QuestionType.DETAILED_RESPONSE &&
          (!question.options || question.options.length === 0)
        ) {
          ctx.addIssue({
            path: [index, "options"],
            message: `At least one option is required.`,
            code: z.ZodIssueCode.custom,
          });
        }

        if (
          (question.type === QuestionType.PHOTO_QUESTION_SINGLE_CHOICE ||
            question.type === QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE) &&
          !question.photoS3Key
        ) {
          ctx.addIssue({
            path: [index, "photoS3Key"],
            message: `Image is required.`,
            code: z.ZodIssueCode.custom,
          });
        }
        if (
          (question.type === QuestionType.FILL_IN_THE_BLANKS_DND ||
            question.type === QuestionType.FILL_IN_THE_BLANKS_TEXT) &&
          (question?.description?.replace(/<\/?[^>]+(>|$)/g, "")?.length ?? 0) < 10
        ) {
          ctx.addIssue({
            path: [index, "description"],
            message: `Description must have at least 10 characters.`,
            code: z.ZodIssueCode.custom,
          });
        }
        if (
          (question.type === QuestionType.SINGLE_CHOICE ||
            question.type === QuestionType.PHOTO_QUESTION_SINGLE_CHOICE ||
            question.type === QuestionType.MULTIPLE_CHOICE ||
            question.type === QuestionType.FILL_IN_THE_BLANKS_DND ||
            question.type === QuestionType.FILL_IN_THE_BLANKS_TEXT || 
            question.type === QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE) &&
          (!question.options || !question.options.some((option) => option.isCorrect === true))
        ) {
          ctx.addIssue({
            path: [index, "options"],
            message: `At least one option must be correct for question.`,
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }),
});

export type QuizLessonFormValues = z.infer<typeof quizLessonFormSchema>;
