import { z } from "zod";
import { QuestionType } from "../QuizLessonForm.types";

export const quizLessonFormSchema = z.object({
  title: z.string(),
  questions: z.array(
    z.object({
      id: z.optional(z.string()),
      type: z.nativeEnum(QuestionType),
      description: z.optional(z.string().min(10, "Question body must be at least 10 characters.")),
      photoS3Key: z.optional(z.string()),
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
            position: z.number(),
          }),
        )
        .optional(),
    }),
  ),
});

export type QuizLessonFormValues = z.infer<typeof quizLessonFormSchema>;
