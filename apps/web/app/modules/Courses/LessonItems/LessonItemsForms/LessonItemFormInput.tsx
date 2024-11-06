import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import type { lessonItemFormSchema } from "./zodFormType.js";
import type { Control } from "react-hook-form";
import type { z } from "zod";

interface LessonItemFormInputInterface {
  control: Control<z.infer<typeof lessonItemFormSchema>>;
  name: "name" | "displayName" | "description" | "video";
  label: string;
  placeholder: string;
}

export const LessonItemFormInput = ({
  control,
  name,
  label,
  placeholder,
}: LessonItemFormInputInterface) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
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
