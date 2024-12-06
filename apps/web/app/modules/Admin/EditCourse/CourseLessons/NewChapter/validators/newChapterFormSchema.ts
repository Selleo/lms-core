import { z } from "zod";

export const newChapterFormSchema = z.object({
  title: z.string(),
});

export type NewChapterFormValues = z.infer<typeof newChapterFormSchema>;
