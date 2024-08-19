import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import MultipleSelector, { Option } from "~/components/ui/multiple-selector";

interface FormMultipleSelectInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  selectOptions: Option[];
  noResult?: string;
}
export const FormMultipleSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  selectOptions,
  noResult = "no results found.",
}: FormMultipleSelectInterface<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        console.log(field.value);
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <MultipleSelector
                value={field.value}
                onChange={field.onChange}
                defaultOptions={selectOptions}
                hideClearAllButton
                placeholder={placeholder}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    {noResult}
                  </p>
                }
              />
            </FormControl>
            <div className="min-h-5">
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};
