import { z } from "zod";
const fileSchema = z.instanceof(File);
const videoSchema = z.union([z.string(), fileSchema, z.array(fileSchema), z.null()]);

const lessonItemFormVideoSchema = z.union([
  z.string(),
  fileSchema,
  z.array(fileSchema),
  z.null(),
  z.undefined(),
]);

export const lessonItemFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  displayName: z
    .string()
    .min(2, { message: "Display Name must be at least 2 characters long" })
    .max(100, { message: "Display Name must be less than 100 characters" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(500, { message: "Description must be less than 500 characters" }),
  video: lessonItemFormVideoSchema.optional().default(null),
});

export const videoLessonItemSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  displayName: z
    .string()
    .min(2, { message: "Display Name must be at least 2 characters long" })
    .max(100, { message: "Display Name must be less than 100 characters" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(500, { message: "Description must be less than 500 characters" }),
  video: videoSchema,
});
