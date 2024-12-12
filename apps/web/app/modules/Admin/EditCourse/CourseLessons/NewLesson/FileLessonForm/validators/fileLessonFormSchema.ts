import { z } from "zod";

export const fileLessonFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(["presentation", "external_presentation", "video", "external_video"]),
  displayOrder: z.number().optional(),
  fileS3Key: z.string(),
  fileType: z.string(),
  chapterId: z.string(),
});

export type FileLessonFormValues = z.infer<typeof fileLessonFormSchema>;
