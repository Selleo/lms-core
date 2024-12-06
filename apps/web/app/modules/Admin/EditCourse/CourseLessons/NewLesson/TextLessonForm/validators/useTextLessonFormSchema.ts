import { z } from "zod";

export const textLessonFormSchema = z.object({
  title: z.string(),
  body: z.string(),
  state: z.enum(["draft", "published"]),
});

export type TextLessonFormValues = z.infer<typeof textLessonFormSchema>;
