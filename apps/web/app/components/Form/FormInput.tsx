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
import { editFormSchema } from "../zodFormType.js";

interface FormInputInterface {
  control: Control<z.infer<typeof editFormSchema>>;
  name: "title" | "status" | "description" | "video";
  label: string;
  placeholder: string;
}

export const FormInput = ({
  control,
  name,
  label,
  placeholder,
}: FormInputInterface) => (
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
