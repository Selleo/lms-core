import { z } from "zod";

export const newTextLessonFormSchema = z.object({
  title: z.string(),
  body: z.string(),
  state: z.enum(["draft", "published"]),
});

export type NewTextLessonFormValues = z.infer<typeof newTextLessonFormSchema>;
