import { z } from "zod";

export const textLessonFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
});

export type TextLessonFormValues = z.infer<typeof textLessonFormSchema>;
