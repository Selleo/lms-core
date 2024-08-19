import { z } from "zod";

export const updateUserTableFilter = z.object({
  role: z.array(z.string()),
  status: z.array(z.string()),
  fullName: z.string(),
});
