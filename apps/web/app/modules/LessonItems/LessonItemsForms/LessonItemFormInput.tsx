import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Control } from "react-hook-form";
import { editLessonItemFormSchema } from "./zodFormType.js";

interface LessonItemFormInputInterface {
  control: Control<z.infer<typeof editLessonItemFormSchema>>;
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
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
