import { z } from "zod";

export const fileLessonFormSchema = z.object({
  title: z.string().min(1, "You need to fill this field to continue."),
  description: z.string(),
  type: z.enum(["presentation", "external_presentation", "video", "external_video"]),
  displayOrder: z.number().optional(),
  fileS3Key: z.string(),
  fileType: z.string(),
});

export type FileLessonFormValues = z.infer<typeof fileLessonFormSchema>;
