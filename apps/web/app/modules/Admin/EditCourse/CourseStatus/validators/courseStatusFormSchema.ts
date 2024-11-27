import { z } from "zod";

export const courseStatusFormSchema = z.object({
  state: z.enum(["draft", "published"]),
});

export type CourseStatusFormValues = z.infer<typeof courseStatusFormSchema>;
