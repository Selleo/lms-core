import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
    <div className="w-full flex gap-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <h5 className="text-xl font-semibold">Pricing</h5>
        </CardHeader>
        <CardContent>
          <p>Set pricing for the course</p>
          <Form {...form}>
            <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursePricing;
