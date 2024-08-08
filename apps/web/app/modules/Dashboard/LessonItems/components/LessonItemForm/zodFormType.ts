import { z } from "zod";

export const editLessonItemFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  status: z
    .string()
    .refine((value) => value === "Published first" || value === "Draft first", {
      message: "Status must be either 'Published first' or 'Draft first'",
    }),
  description: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(1000, { message: "Name must be less than 1000 characters" }),
  video: z.any(),
});
