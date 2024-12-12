
import { z } from "zod";

export const textLessonFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  displayOrder: z.number().optional(),
  fileS3Key: z.string().optional(),
  fileType: z.string().optional(),
  chapterId: z.string(),
});

export type TextLessonFormValues = z.infer<typeof textLessonFormSchema>;
