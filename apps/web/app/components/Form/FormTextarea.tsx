import { Textarea } from "~/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";
import { editFormSchema } from "../zodFormType.js";

interface FormTextareaInterface {
  control: Control<z.infer<typeof editFormSchema>>;
  name: "title" | "status" | "description" | "video";
  label: string;
  placeholder: string;
}

export const FormTextarea = ({
  control,
  name,
  label,
  placeholder,
}: FormTextareaInterface) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea placeholder={placeholder} {...field} />
        </FormControl>
        <div className="min-h-5">
          <FormMessage />
        </div>
      </FormItem>
    )}
  />
);
