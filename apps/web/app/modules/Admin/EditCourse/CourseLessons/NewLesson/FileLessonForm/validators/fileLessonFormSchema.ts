import { z } from "zod";

export const fileLessonFormSchema = z.object({
  title: z.string(),
  body: z.optional(z.string()),
  state: z.enum(["draft", "published"]),
  type: z.enum(["presentation", "external_presentation", "video", "external_video"]),
  url: z.string(),
});

export type FileLessonFormValues = z.infer<typeof fileLessonFormSchema>;
