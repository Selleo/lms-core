import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { InputHTMLAttributes } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type FormTextFieldProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export const FormTextField = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormTextFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <Label htmlFor={name}>
                {props.required && <span className="text-error-600">* </span>}
                {label}
              </Label>
            )}
            <FormControl>
              <Input {...field} {...props} id={name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
