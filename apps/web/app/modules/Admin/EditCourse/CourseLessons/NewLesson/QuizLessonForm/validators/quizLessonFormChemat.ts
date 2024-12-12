import { z } from "zod";

export const quizLessonFormSchema = z.object({
  title: z.string(),
  state: z.enum(["draft", "published"]),
  questions: z.array(
    z.object({
      questionType: z.enum(["single_choice", "multiple_choice"]),
      questionBody: z.optional(z.string().min(10, "Question body must be at least 10 characters.")),
      state: z.enum(["draft", "published"]),
      imageUrl: z.optional(z.string()),
      photoQuestionType: z.optional(z.enum(["single_choice", "multiple_choice"])),
      questionTitle: z.string(),
      options: z
        .array(
          z.object({
            value: z.string().min(1, "Option text is required"),
            isCorrect: z.boolean(),
            position: z.number(),
          }),
        )
        .optional(),
    }),
  ),
});

export type QuizLessonFormValues = z.infer<typeof quizLessonFormSchema>;
