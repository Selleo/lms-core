import { z } from "zod";

export const addCourseFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.union([z.string().url("Invalid image URL"), z.string().length(0)]).optional(),
});

export type AddCourseFormValues = z.infer<typeof addCourseFormSchema>;
