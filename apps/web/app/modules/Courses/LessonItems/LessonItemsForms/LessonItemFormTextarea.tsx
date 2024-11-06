import { type Control } from "react-hook-form";
import { type z } from "zod";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

import { type lessonItemFormSchema } from "./zodFormType.js";

interface LessonItemFormTextareaInterface {
  control: Control<z.infer<typeof lessonItemFormSchema>>;
  name: "name" | "displayName" | "description" | "video";
  label: string;
  placeholder: string;
}

export const LessonItemFormTextarea = ({
  control,
  name,
  label,
  placeholder,
}: LessonItemFormTextareaInterface) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
