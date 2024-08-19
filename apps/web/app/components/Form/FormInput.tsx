import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
}
export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormInputInterface<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        <div className="min-h-5">
          <FormMessage />
        </div>
      </FormItem>
    )}
  />
);
