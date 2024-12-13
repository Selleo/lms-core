import { z } from "zod";

export const courseStatusFormSchema = z.object({
  isPublished: z.boolean(),
});

export type CourseStatusFormValues = z.infer<typeof courseStatusFormSchema>;
