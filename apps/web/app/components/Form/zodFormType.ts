import { z } from "zod";

export const editLessonItemFormTextSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  status: z
    .string()
    .refine((value) => value === "Published first" || value === "Draft first", {
      message: "Status must be either 'Published first' or 'Draft first'",
    }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
});

export const videoSchema = z
  .any()
  .nullable()
  .refine((val) => val !== null, {
    message: "Video is required",
  });

export const editLessonItemFormVideoSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  status: z
    .string()
    .refine((value) => value === "Published first" || value === "Draft first", {
      message: "Status must be either 'Published first' or 'Draft first'",
    }),
  video: videoSchema,
});
