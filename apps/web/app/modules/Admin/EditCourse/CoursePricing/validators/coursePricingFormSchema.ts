import { z } from "zod";

export const coursePricingFormSchema = z.object({
  priceInCents: z.number(),
  currency: z.string().optional().default("usd"),
});

export type CoursePricingFormValues = z.infer<typeof coursePricingFormSchema>;
