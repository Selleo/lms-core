import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { CustomCheckbox } from "../CustomCheckbox.js";
interface SelectGroupProps {
  labelValue?: string;
  selectItemList: string[];
}
interface FormSelectInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  defaultValue: string;
  label?: string;
  selectItems: SelectGroupProps[];
}

export const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  label,
  selectItems,
}: FormSelectInterface<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              {label && <FormLabel>{label}</FormLabel>}
              <CustomCheckbox
                value={field.value}
                defaultValue={defaultValue}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                selectItems={selectItems}
              />
            </>
          </FormControl>
          <div className="min-h-5">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
