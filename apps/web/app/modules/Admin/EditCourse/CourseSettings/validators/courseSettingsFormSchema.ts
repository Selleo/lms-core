import { z } from "zod";

export const courseSettingsFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  categoryId: z.string().min(1, "Category is required"),
  thumbnailS3Key: z.string().optional(),
});

export type CourseSettingsFormValues = z.infer<typeof courseSettingsFormSchema>;
