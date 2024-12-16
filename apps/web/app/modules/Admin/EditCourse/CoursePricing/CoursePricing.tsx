import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { useCoursePricingForm } from "./hooks/useCoursePricingForm";

type CoursePricingProps = {
  courseId: string;
  priceInCents?: number;
  currency?: string;
};

const CoursePricing = ({ courseId, priceInCents, currency }: CoursePricingProps) => {
  const { form, onSubmit } = useCoursePricingForm({ courseId, priceInCents, currency });

  return (
    <div className="w-full flex gap-y-6 bg-white rounded-lg p-8 flex-col max-w-[744px]">
      <div className="gap-y-1.5 flex flex-col">
        <h5 className="h5 text-neutral-950">Pricing</h5>
        <p className="text-neutral-900 body-base">Set pricing for the course</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || "usd"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceInCents"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start">
                <Label htmlFor="priceInCents" className="text-right">
                  Price
                </Label>
                <FormControl>
                  <Input
                    id="priceInCents"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default CoursePricing;
